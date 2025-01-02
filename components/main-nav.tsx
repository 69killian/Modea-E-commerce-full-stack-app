"use client";
import React from 'react';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link'; 
import { cn } from '@/lib/utils';

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Vue d'ensemble",
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathname === `/${params.storeId}/billboards`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Paramètres',
            active: pathname === `/${params.storeId}/settings`,
        },
    ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
        {routes.map((route) => (
            <Link 
                key={route.href} 
                href={route.href} 
                className={cn(
                    "text-sm font-medium transition-colors hover:text-gray-700",
                    route.active ? "text-white dark:text-white" : "text-muted-foreground"
                )}
            >
                {route.label}
            </Link>
        ))}
    </nav>
  );
}
