import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { urlService } from "@/services/urlService";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlShortenerSchema, type UrlShortenerFormData } from "@/lib/validation";

import type { LinkModalProps } from "@/types/component.types";

export const LinkModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    buttonText,
    longUrl,
    setLongUrl,
    customSlug,
    setCustomSlug,
    tags,
    setTags,
    excludeId,
    isSubmitLoading = false
}: LinkModalProps) => {
    const [currentTag, setCurrentTag] = useState("");
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<UrlShortenerFormData>({
        resolver: zodResolver(urlShortenerSchema),
        defaultValues: {
            longUrl: '',
            customSlug: '',
        },
    });

    const slugValue = watch("customSlug");
    const debouncedSlug = useDebounce(slugValue || "", 500);

    const onFormSubmit = (data: UrlShortenerFormData) => {
        setLongUrl(data.longUrl || '');
        setCustomSlug(data.customSlug || '');
        onSubmit(data);
    };

    useEffect(() => {
        if (isOpen) {
            reset({
                longUrl,
                customSlug,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        const checkSlug = async () => {
            if (!debouncedSlug || debouncedSlug.trim() === "") {
                setIsAvailable(null);
                return;
            }

            setIsValidating(true);
            try {
                const response = await urlService.checkAvailability(debouncedSlug, excludeId);
                setIsAvailable(response.available);
            } catch (err) {
                console.error("Failed to check slug availability", err);
                setIsAvailable(null);
            } finally {
                setIsValidating(false);
            }
        };

        checkSlug();
    }, [debouncedSlug, excludeId]);

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (!currentTag.trim()) return;
        if (tags.some(t => t.name.toLowerCase() === currentTag.trim().toLowerCase())) {
            setCurrentTag("");
            return;
        }
        setTags([...tags, { name: currentTag.trim(), color: "bg-amber-400" }]);
        setCurrentTag("");
    };

    const handleRemoveTag = (tagName: string) => {
        setTags(tags.filter(t => t.name !== tagName));
    };

    const canSubmit = !isValidating && (isAvailable === null || isAvailable === true) && Object.keys(errors).length === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm shadow-2xl">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">{title}</h2>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Destination URL</label>
                        <input
                            type="text"
                            placeholder="https://example.com/long-url"
                            {...register("longUrl")}
                            className={cn(
                                "w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:bg-white text-gray-900 placeholder:text-gray-400",
                                errors.longUrl
                                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                                    : "border-gray-200 focus:border-amber-400 focus:ring-amber-400/10"
                            )}
                        />
                        {errors.longUrl && (
                            <p className="text-xs text-red-500 font-medium mt-1">{errors.longUrl.message}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5 ml-1">
                            <label className="block text-sm font-bold text-gray-700">Custom slug (Optional)</label>
                            {isValidating && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider animate-pulse">
                                    <Loader2 size={10} className="animate-spin" /> Checking
                                </span>
                            )}
                        </div>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-gray-400 font-medium text-sm select-none">
                                litbee.io/
                            </div>
                            <input
                                type="text"
                                placeholder="custom-slug"
                                {...register("customSlug", {
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');
                                    }
                                })}
                                className={cn(
                                    "w-full bg-gray-50 border rounded-xl pl-[76px] pr-4 py-3 outline-none text-sm transition-all focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium",
                                    errors.customSlug && "border-red-400 focus:border-red-400 focus:ring-red-400/10",
                                    isAvailable === true && !errors.customSlug && "border-green-500 focus:border-green-500 focus:ring-green-500/10",
                                    isAvailable === false && !errors.customSlug && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                                    isAvailable === null && !errors.customSlug && "border-gray-200 focus:border-amber-400 focus:ring-amber-400/10"
                                )}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                {isAvailable === true && !errors.customSlug && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        <CheckCircle2 size={10} strokeWidth={3} /> Available
                                    </span>
                                )}
                                {isAvailable === false && !errors.customSlug && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        <AlertCircle size={10} strokeWidth={3} /> Taken
                                    </span>
                                )}
                            </div>
                        </div>
                        {errors.customSlug && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-bold ml-1">{errors.customSlug.message}</p>
                        )}
                        {isAvailable === false && !errors.customSlug && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-bold ml-1 flex items-center gap-1">
                                This slug is already in use by another link.
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Tags</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add a tag..."
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 text-sm transition-all focus:bg-white text-gray-900 placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[36px] items-center bg-gray-50/50 p-2 rounded-xl border border-dashed border-gray-200">
                            {tags.map((tag) => (
                                <div key={tag.name} className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold animate-in fade-in scale-in-95">
                                    <span>{tag.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag.name)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            {tags.length === 0 && <span className="text-xs text-gray-400 italic ml-1">Organize with tags</span>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!canSubmit || isSubmitLoading}
                        className={cn(
                            "w-full font-black py-3 rounded-xl mt-6 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg",
                            canSubmit && !isSubmitLoading
                                ? "bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        {isSubmitLoading && <Loader2 size={18} className="animate-spin" />}
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
};
