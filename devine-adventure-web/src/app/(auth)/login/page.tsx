'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useLogin } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputClass =
  'w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors';

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
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-10"
        >
          <Image
            src="/devine-icon.png"
            alt=""
            width={512}
            height={512}
            className="w-11 h-11"
          />
          <span className="font-display font-black text-xl leading-none">
            <span className="text-white">Devine</span>{' '}
            <span className="text-[#29692f]">Adventures</span>
          </span>
        </Link>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-black text-white mb-1">
            Welcome back
          </h1>
          <p className="text-stone-400 text-sm mb-8">
            Sign in to book your next adventure
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-amber-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
