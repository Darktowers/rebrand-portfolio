"use client";

import { motion } from "motion/react";

interface SkeletonProps {
	className?: string;
	/** Number of repeating rows (for list skeletons) */
	rows?: number;
}

/** Single shimmer skeleton block */
export function Skeleton({ className = "" }: SkeletonProps) {
	return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** Card skeleton — matches the project card shape */
export function CardSkeleton() {
	return (
		<motion.div
			className="glass rounded-xl overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Skeleton className="h-44 w-full rounded-none" />
			<div className="p-4 space-y-3">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<div className="flex gap-2 pt-1">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-6 w-16 rounded-full" />
					))}
				</div>
			</div>
		</motion.div>
	);
}

/** Experience row skeleton */
export function ExperienceSkeleton({ rows = 3 }: SkeletonProps) {
	return (
		<div className="space-y-6">
			{Array.from({ length: rows }).map((_, i) => (
				<motion.div
					key={i}
					className="flex gap-4"
					initial={{ opacity: 0, x: -16 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: i * 0.08 }}
				>
					<div className="flex flex-col items-center">
						<Skeleton className="w-3 h-3 rounded-full shrink-0 mt-1" />
						{i < rows - 1 && (
							<div
								className="w-px flex-1 mt-1"
								style={{ background: "var(--border)" }}
							/>
						)}
					</div>
					<div className="flex-1 pb-6 space-y-2">
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
					</div>
				</motion.div>
			))}
		</div>
	);
}
