import React, { Fragment } from "react";
import type { AuthMode } from "@/types/auth.types";

interface AuthTabsProps {
    mode: AuthMode;
    switchMode: (mode: AuthMode) => void;
    verificationEmail: string;
    hasUser: boolean;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
    mode,
    switchMode,
    verificationEmail,
    hasUser
}) => {
    return (
        <div className="flex items-center gap-1 mb-8">
            {([
                { id: "login", label: "Sign In", visible: true },
                { id: "signup", label: "Sign Up", visible: true },
                { id: "verify", label: "Verify", visible: !!verificationEmail || hasUser }
            ] as const).filter(m => m.visible).map((m, i) => (
                <Fragment key={m.id}>
                    {i > 0 && <span className="text-gray-300 text-sm">/</span>}
                    <button
                        onClick={() => switchMode(m.id as AuthMode)}
                        className={`text-sm font-semibold px-1 pb-0.5 transition-all duration-200 border-b-2 ${mode === m.id
                            ? "text-[#0a0a0a] border-amber-400"
                            : "text-gray-400 border-transparent hover:text-gray-600"
                            }`}
                    >
                        {m.label}
                    </button>
                </Fragment>
            ))}
        </div>
    );
};
