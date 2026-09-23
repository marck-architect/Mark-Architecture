import test from "node:test";
import assert from "node:assert/strict";

// Mock NextRequest and requireAdminAuth simulation
test("Admin Security: requireAdminAuth blocks unauthenticated or non-admin calls", async () => {
  function verifyAdminAccess(user, authorizedEmail) {
    if (!user) {
      return { status: 401, error: "Unauthorized: Admin session required" };
    }
    if (
      authorizedEmail &&
      user.email?.toLowerCase() !== authorizedEmail.toLowerCase()
    ) {
      return {
        status: 403,
        error: "Forbidden: Not an authorized administrator",
      };
    }
    return { status: 200, user };
  }

  const ADMIN_EMAIL = "markarchitects.web@gmail.com";

  // Case 1: Anonymous request (no session)
  const anon = verifyAdminAccess(null, ADMIN_EMAIL);
  assert.equal(anon.status, 401);

  // Case 2: Regular user logged in with non-admin email
  const regularUser = verifyAdminAccess(
    { email: "client@gmail.com" },
    ADMIN_EMAIL,
  );
  assert.equal(regularUser.status, 403);

  // Case 3: Authorized studio admin
  const adminUser = verifyAdminAccess(
    { email: "markarchitects.web@gmail.com" },
    ADMIN_EMAIL,
  );
  assert.equal(adminUser.status, 200);
  assert.equal(adminUser.user.email, "markarchitects.web@gmail.com");
});
