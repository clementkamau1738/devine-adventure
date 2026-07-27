'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useBookingStore } from '@/store/booking.store';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { formatKES, getApiErrorMessage } from '@/lib/utils';
import { Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { currentBooking, pricing, paymentMethod, setPaymentMethod } =
    useBookingStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [processing, setProcessing] = useState(false);
  const [stkSent, setStkSent] = useState(false);

  useEffect(() => {
    if (!currentBooking || !pricing) router.push('/events');
  }, [currentBooking, pricing, router]);

  if (!currentBooking || !pricing) return null;

  const handleMpesa = async () => {
    if (!phone.match(/^\+254[0-9]{9}$/)) {
      toast.error('Enter a valid Kenyan phone number (+254...)');
      return;
    }
    setProcessing(true);
    try {
      await api.post(`/payments/mpesa/initiate/${currentBooking.id}`, {
        phone,
      });
      setStkSent(true);
      toast.success('STK Push sent! Check your phone.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Payment initiation failed'));
    } finally {
      setProcessing(false);
    }
  };

  const handleStripe = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post(
        `/payments/stripe/session/${currentBooking.id}`,
      );
      window.location.href = data.data.sessionUrl;
    } catch {
      toast.error('Could not initiate card payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <h1 className="font-display text-4xl font-black text-white mb-2">
            Payment
          </h1>
          <p className="text-stone-400 mb-8">
            Ref:{' '}
            <span className="text-amber-400 font-mono">
              {currentBooking.referenceCode}
            </span>
          </p>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-8 flex justify-between items-center">
            <span className="text-stone-300">Amount due</span>
            <span className="text-white font-black text-2xl">
              {formatKES(pricing.finalPrice)}
            </span>
          </div>

          {/* Payment method selection */}
          {!stkSent && (
            <div className="space-y-4 mb-8">
              <h2 className="text-stone-300 font-semibold">
                Choose payment method
              </h2>

              {/* M-Pesa */}
              <button
                onClick={() => setPaymentMethod('mpesa')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  paymentMethod === 'mpesa'
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-stone-700 hover:border-stone-500'
                }`}
              >
                <Smartphone className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <div className="text-white font-semibold">M-Pesa</div>
                  <div className="text-stone-400 text-sm">
                    Pay via Safaricom STK Push
                  </div>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-stone-700 hover:border-stone-500'
                }`}
              >
                <CreditCard className="w-6 h-6 text-blue-400" />
                <div className="text-left">
                  <div className="text-white font-semibold">
                    Card (Visa / Mastercard)
                  </div>
                  <div className="text-stone-400 text-sm">
                    Secure payment via Stripe
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* M-Pesa phone input */}
          {paymentMethod === 'mpesa' && !stkSent && (
            <div className="mb-6">
              <label className="block text-stone-300 text-sm font-medium mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254712345678"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* STK sent state */}
          {stkSent && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl mb-3">📱</div>
              <div className="text-white font-bold mb-2">STK Push Sent!</div>
              <div className="text-stone-300 text-sm">
                Enter your M-Pesa PIN on your phone to complete the payment.
                Your booking will be confirmed automatically.
              </div>
              <button
                onClick={() =>
                  router.push(
                    `/booking/success?ref=${currentBooking.referenceCode}`,
                  )
                }
                className="mt-6 text-amber-400 text-sm underline"
              >
                I&apos;ve completed payment →
              </button>
            </div>
          )}

          {!stkSent && paymentMethod && (
            <button
              onClick={paymentMethod === 'mpesa' ? handleMpesa : handleStripe}
              disabled={processing}
              className="w-full bg-forest text-neutral-50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-forest-hover disabled:opacity-50 transition-colors"
            >
              {processing ? 'Processing...' : `Pay ${formatKES(pricing.finalPrice)}`}
              {!processing && <ArrowRight className="w-5 h-5" />}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
