-- ==============================================================================
-- Migration: 20260928_orders_payment_rls.sql
-- Description: Allow public and authenticated callers to update payment status
--              and safepay tracking identifiers on orders and consultations
-- ==============================================================================

-- 1. Ensure RLS is active on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop any legacy restrictive update policy
DROP POLICY IF EXISTS "Public update order payment" ON public.orders;
DROP POLICY IF EXISTS "Allow public update order payment" ON public.orders;

-- 3. Create permissive update policy for orders to support server callbacks and webhooks
CREATE POLICY "Allow public update order payment" ON public.orders
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Ensure consultations can also receive payment status updates
DROP POLICY IF EXISTS "Public update consultation payment" ON public.consultations;
DROP POLICY IF EXISTS "Allow public update consultation payment" ON public.consultations;

CREATE POLICY "Allow public update consultation payment" ON public.consultations
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);
