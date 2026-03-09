// Landing Components
export interface StepCardProps {
    number: string;
    title: string;
    desc: string;
    icon: React.ElementType;
}

export interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    badge?: string;
}

export interface ExtendedFaqEntry {
    q: string;
    a: string;
    value: string;
}

// Modal Components
export interface QrModalProps {
    isOpen: boolean;
    onClose: () => void;
    shortUrl: string;
}

export interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    shortUrl: string;
}

export interface LinkSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    shortUrl: string;
    longUrl: string;
}

// Link Modal
export interface Tag {
    name: string;
    color: string;
}

export interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    buttonText: string;
    longUrl: string;
    setLongUrl: (val: string) => void;
    customSlug: string;
    setCustomSlug: (val: string) => void;
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    excludeId?: string;
    isSubmitLoading?: boolean;
}

// Route
export interface ProtectedRouteProps {
    redirectPath?: string;
    isAllowed?: boolean;
}
