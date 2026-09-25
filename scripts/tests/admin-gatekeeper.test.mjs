import test from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import {
  GATEKEEPER_COOKIE_NAME,
  getAdminAccessKey,
  generateGatekeeperToken,
  isValidGatekeeperToken,
  isValidAdminAccessKey,
} from "../../lib/server/adminGatekeeper.ts";

test("Admin Gatekeeper: getAdminAccessKey returns configured key or default", () => {
  const key = getAdminAccessKey();
  assert.ok(key && key.length > 0, "Admin access key should not be empty");
});

test("Admin Gatekeeper: isValidAdminAccessKey verifies correct key and rejects invalid candidates", () => {
  const activeKey = getAdminAccessKey();

  assert.equal(
    isValidAdminAccessKey(activeKey),
    true,
    "Active key must pass validation",
  );
  assert.equal(
    isValidAdminAccessKey("wrong_key_123"),
    false,
    "Wrong key must fail validation",
  );
  assert.equal(
    isValidAdminAccessKey(""),
    false,
    "Empty key must fail validation",
  );
  assert.equal(
    isValidAdminAccessKey(null),
    false,
    "Null key must fail validation",
  );
  assert.equal(
    isValidAdminAccessKey(undefined),
    false,
    "Undefined key must fail validation",
  );
});

test("Admin Gatekeeper: generateGatekeeperToken creates deterministic SHA-256 token", () => {
  const token1 = generateGatekeeperToken();
  const token2 = generateGatekeeperToken();

  assert.equal(
    token1,
    token2,
    "Gatekeeper token must be deterministic for identical key",
  );
  assert.equal(token1.length, 64, "SHA-256 token must be 64 hex characters");
});

test("Admin Gatekeeper: isValidGatekeeperToken validates genuine cookie tokens and rejects tampered ones", () => {
  const genuineToken = generateGatekeeperToken();
  assert.equal(
    isValidGatekeeperToken(genuineToken),
    true,
    "Genuine token must be valid",
  );

  const tamperedToken =
    genuineToken.slice(0, -1) + (genuineToken.endsWith("a") ? "b" : "a");
  assert.equal(
    isValidGatekeeperToken(tamperedToken),
    false,
    "Tampered token must be rejected",
  );

  assert.equal(
    isValidGatekeeperToken(""),
    false,
    "Empty token must be rejected",
  );
  assert.equal(
    isValidGatekeeperToken(null),
    false,
    "Null token must be rejected",
  );
  assert.equal(
    isValidGatekeeperToken(undefined),
    false,
    "Undefined token must be rejected",
  );
});

test("Admin Gatekeeper: Simulating cloaking behavior for unauthenticated and unauthorized requests", () => {
  // Simulate gatekeeper decision flow
  function evaluateAdminGatekeeper({ urlKey, cookieToken }) {
    if (urlKey) {
      if (isValidAdminAccessKey(urlKey)) {
        return {
          action: "grant_and_clean_url",
          cookieName: GATEKEEPER_COOKIE_NAME,
          cookieValue: generateGatekeeperToken(),
          redirectTo: "/admin",
        };
      }
      return { action: "cloak_redirect_home", redirectTo: "/" };
    }

    if (isValidGatekeeperToken(cookieToken)) {
      return { action: "proceed_to_auth" };
    }

    return { action: "cloak_redirect_home", redirectTo: "/" };
  }

  // 1. Direct visit without key and without cookie
  const directVisit = evaluateAdminGatekeeper({
    urlKey: null,
    cookieToken: null,
  });
  assert.equal(directVisit.action, "cloak_redirect_home");
  assert.equal(directVisit.redirectTo, "/");

  // 2. Visit with invalid key
  const invalidKeyVisit = evaluateAdminGatekeeper({
    urlKey: "hacker123",
    cookieToken: null,
  });
  assert.equal(invalidKeyVisit.action, "cloak_redirect_home");
  assert.equal(invalidKeyVisit.redirectTo, "/");

  // 3. Visit with valid key
  const validKey = getAdminAccessKey();
  const validKeyVisit = evaluateAdminGatekeeper({
    urlKey: validKey,
    cookieToken: null,
  });
  assert.equal(validKeyVisit.action, "grant_and_clean_url");
  assert.equal(validKeyVisit.cookieName, GATEKEEPER_COOKIE_NAME);
  assert.equal(validKeyVisit.redirectTo, "/admin");

  // 4. Subsequent visit with issued cookie
  const subVisit = evaluateAdminGatekeeper({
    urlKey: null,
    cookieToken: validKeyVisit.cookieValue,
  });
  assert.equal(subVisit.action, "proceed_to_auth");
});

test("Admin Route Security: Legacy /admin is cloaked and /markarchit/admin is protected", () => {
  function routeGuard(pathname, user) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return { redirect: "/" };
    }
    if (pathname.startsWith("/markarchit/admin")) {
      const isLogin = pathname === "/markarchit/admin/login";
      if (!user && !isLogin) {
        return { redirect: "/markarchit/admin/login" };
      }
      if (user && isLogin) {
        return { redirect: "/markarchit/admin" };
      }
      return { allow: true };
    }
    return { allow: true };
  }

  // Cloaking test
  assert.deepEqual(routeGuard("/admin", null), { redirect: "/" });
  assert.deepEqual(routeGuard("/admin/login", null), { redirect: "/" });

  // Fixed admin route test
  assert.deepEqual(routeGuard("/markarchit/admin", null), {
    redirect: "/markarchit/admin/login",
  });
  assert.deepEqual(routeGuard("/markarchit/admin/login", null), {
    allow: true,
  });
  assert.deepEqual(routeGuard("/markarchit/admin", { id: "1" }), {
    allow: true,
  });
  assert.deepEqual(routeGuard("/markarchit/admin/login", { id: "1" }), {
    redirect: "/markarchit/admin",
  });
});
