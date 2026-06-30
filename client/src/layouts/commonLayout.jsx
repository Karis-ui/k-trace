// src/layouts/CommonPageLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function CommonPageLayout({
    children,
    title,
    subtitle,
    breadcrumbs = [],
    actions
}) {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition mb-4"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <ChevronRight className="h-3 w-3" />}
                            {crumb.url ? (
                                <button
                                    onClick={() => navigate(crumb.url)}
                                    className="hover:text-gray-700 dark:hover:text-gray-200 transition"
                                >
                                    {crumb.label}
                                </button>
                            ) : (
                                <span className="text-gray-700 dark:text-gray-200 font-medium">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                {children}
            </div>
        </div>
    );
}