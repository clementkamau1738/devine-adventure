'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useLogin } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputClass =
  'w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-ink text-sm placeholder-neutral-400 focus:outline-none focus:border-forest transition-colors';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { mutateAsync: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values);
      router.push(redirect);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-forest text-neutral-50 font-bold py-3.5 rounded-xl hover:bg-forest-hover disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 min-h-0 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo className="h-12" priority />
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-normal text-ink mb-1 uppercase tracking-normal">
            Welcome back
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            Sign in to book your next adventure
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-forest hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
