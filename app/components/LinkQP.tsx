
'use client';

import Link, { LinkProps } from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import { customHref } from './utils';

interface LinkQPProps extends LinkProps {
    children?: ReactNode;
    className?: string;
    ref?: any;
    href: any;
}
export function LinkQP({
    ref,
    className,
    href,
    children,
}: LinkQPProps) {
    const searchParams = useSearchParams();
    const resolvedHref = customHref(searchParams, href);
    return (
        <Link ref={ref} className={className} href={resolvedHref}>
            {children}
        </Link>
    );
}
