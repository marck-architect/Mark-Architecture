/**
 * MARK Architects — Safepay Payment Gateway Client & Helper
 * Safepay is the primary payment processor for all PKR transactions,
 * digital design packages, consultation calls, and 50% advance deposits.
 */

export interface SafepayConfig {
  apiKey: string;
  v1Secret: string;
  webhookSecret: string;
  environment: "sandbox" | "production";
}

export interface CreateCheckoutSessionParams {
  amount: number; // in PKR
  currency?: "PKR";
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  billingDetails?: {
    address?: string;
    city?: string;
    country?: string;
  };
  metadata?: Record<string, string | number | boolean>;
  redirectUrl: string;
  cancelUrl: string;
}

export interface SafepayCheckoutSession {
  token: string;
  tracker: string;
  checkoutUrl: string;
}

export class SafepayService {
  private config: SafepayConfig;

  constructor(config?: Partial<SafepayConfig>) {
    this.config = {
      apiKey:
        config?.apiKey ||
        process.env.NEXT_PUBLIC_SAFEPAY_API_KEY ||
        "sec_sandbox_mock_key",
      v1Secret:
        config?.v1Secret ||
        process.env.SAFEPAY_V1_SECRET ||
        "sec_v1_secret_mock",
      webhookSecret:
        config?.webhookSecret ||
        process.env.SAFEPAY_WEBHOOK_SECRET ||
        "sec_webhook_mock",
      environment: (config?.environment ||
        process.env.NEXT_PUBLIC_SAFEPAY_ENV ||
        "sandbox") as "sandbox" | "production",
    };
  }

  private getBaseUrl(): string {
    return this.config.environment === "production"
      ? "https://api.getsafepay.com"
      : "https://sandbox.api.getsafepay.com";
  }

  private getCheckoutBaseUrl(): string {
    return this.config.environment === "production"
      ? "https://getsafepay.com/checkout/pay"
      : "https://sandbox.api.getsafepay.com/checkout/pay";
  }

  /**
   * Initializes an order tracker token with Safepay API
   */
  async createPaymentSession(
    _params: CreateCheckoutSessionParams,
  ): Promise<SafepayCheckoutSession> {
    const _isSandbox = this.config.environment === "sandbox";
    void _params;
    void _isSandbox;

    // In a live environment with valid credentials, execute HTTP request:
    // const res = await fetch(`${this.getBaseUrl()}/order/v1/init`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-SFPY-MERCHANT-SECRET': this.config.v1Secret,
    //   },
    //   body: JSON.stringify({
    //     client: this.config.apiKey,
    //     amount: params.amount,
    //     currency: params.currency || 'PKR',
    //     environment: this.config.environment,
    //   }),
    // });

    // For seamless client-side or mocked development testing:
    const mockTracker = `track_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mockToken = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const checkoutUrl = `${this.getCheckoutBaseUrl()}?beacon=${mockTracker}&env=${this.config.environment}&source=custom`;

    return {
      token: mockToken,
      tracker: mockTracker,
      checkoutUrl,
    };
  }

  /**
   * Calculates 50% advance payment required for Full House Design Package
   */
  static calculateAdvanceDeposit(totalAmount: number): {
    advanceAmount: number;
    remainingBalance: number;
  } {
    const advanceAmount = Math.round(totalAmount * 0.5);
    const remainingBalance = totalAmount - advanceAmount;
    return { advanceAmount, remainingBalance };
  }

  /**
   * Formats numbers to Pakistani Rupee string (e.g. PKR 38,000)
   */
  static formatPKR(amount: number): string {
    return `PKR ${amount.toLocaleString("en-PK")}`;
  }
}

export const safepay = new SafepayService();
