/**
 * MARK Architects — Payment helpers.
 * All PKR transactions (design packages, consultation calls, 50% advance
 * deposits) are settled manually via bank transfer or JazzCash — the
 * customer pays, uploads a screenshot as proof, and the studio confirms
 * from the admin panel. These are pure display/calculation helpers only.
 */
export class PaymentService {
  /** Splits a total into a 50% advance deposit and the remaining balance. */
  static calculateAdvanceDeposit(totalAmount: number): {
    advanceAmount: number;
    remainingBalance: number;
  } {
    const advanceAmount = Math.round(totalAmount * 0.5);
    const remainingBalance = totalAmount - advanceAmount;
    return { advanceAmount, remainingBalance };
  }

  /** Formats a number as a Pakistani Rupee string (e.g. "PKR 38,000"). */
  static formatPKR(amount: number): string {
    return `PKR ${amount.toLocaleString("en-PK")}`;
  }
}
