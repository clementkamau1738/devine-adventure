'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRegister } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';

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
  'w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-ink text-sm placeholder-neutral-400 focus:outline-none focus:border-forest transition-colors';

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
        <label className="block text-neutral-600 text-sm font-medium mb-1.5">
          Full Name
        </label>
        <input
          {...register('name')}
          className={inputClass}
          placeholder="Jane Wanjiru"
        />
        {errors.name && (
          <p className="text-clay text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-neutral-600 text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-clay text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-neutral-600 text-sm font-medium mb-1.5">
          Phone <span className="text-neutral-500 font-normal">(optional)</span>
        </label>
        <input
          {...register('phone')}
          className={inputClass}
          placeholder="+254712345678"
        />
        {errors.phone && (
          <p className="text-clay text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-neutral-600 text-sm font-medium mb-1.5">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className={inputClass}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-clay text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-neutral-600 text-sm font-medium mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className={inputClass}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-clay text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-forest text-neutral-50 font-bold py-3.5 rounded-xl hover:bg-forest-hover disabled:opacity-50 transition-colors"
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
        <div className="flex justify-center mb-10">
          <Logo className="h-12" priority />
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-normal text-ink mb-1 uppercase tracking-normal">
            Create your account
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Join Kenya&apos;s adventure collective
          </p>

          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-forest hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
