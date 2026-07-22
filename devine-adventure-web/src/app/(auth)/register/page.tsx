'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mountain } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRegister } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/utils';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    phone: z
      .string()
      .regex(/^\+254[0-9]{9}$/, 'Use a valid Kenyan number (+254...)')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Must contain uppercase, lowercase, and a number',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof registerSchema>;

const inputClass =
  'w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { mutateAsync: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      toast.success('Account created — welcome to Devine Adventure!');
      router.push(redirect);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not create account'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-stone-300 text-sm font-medium mb-1.5">
          Full Name
        </label>
        <input
          {...register('name')}
          className={inputClass}
          placeholder="Jane Wanjiru"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-stone-300 text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-stone-300 text-sm font-medium mb-1.5">
          Phone <span className="text-stone-500 font-normal">(optional)</span>
        </label>
        <input
          {...register('phone')}
          className={inputClass}
          placeholder="+254712345678"
        />
        {errors.phone && (
          <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-stone-300 text-sm font-medium mb-1.5">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className={inputClass}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-stone-300 text-sm font-medium mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className={inputClass}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl hover:bg-amber-300 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-10"
        >
          <Mountain className="w-7 h-7 text-amber-400" />
          <span className="font-display font-black text-xl text-white">
            Devine<span className="text-amber-400">.</span>
          </span>
        </Link>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-black text-white mb-1">
            Create your account
          </h1>
          <p className="text-stone-400 text-sm mb-8">
            Join Kenya&apos;s adventure collective
          </p>

          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
