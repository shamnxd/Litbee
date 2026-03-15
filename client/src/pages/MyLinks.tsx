import { useState, useRef, useEffect } from "react";
import { Search, Plus, Copy, QrCode, PenIcon, Trash2, ArrowUpRight, Check, LogOut, Settings, ChevronDown } from "lucide-react";
import { LitbeeLogo } from "@/components/shared/LitbeeLogo";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { urlService } from "@/services/urlService";
import { useDebounce } from "@/hooks/useDebounce";
import { authService } from "@/services/authService";
import type { LinkItem, RawUrlItem } from "@/types/link.types";

// Shared Modals
import { LinkSuccessModal } from "@/components/shared/LinkSuccessModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { QrModal } from "@/components/shared/QrModal";
import { LinkModal } from "@/components/shared/LinkModal";

import { isAxiosError } from "axios";
export default function MyLinks() {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastLinkElementRef = useRef<HTMLDivElement | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successData, setSuccessData] = useState<{ short: string, long: string } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [, setPage] = useState(1);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Form states
    const [longUrl, setLongUrl] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

    const fetchLinks = async (pageNum: number, search: string, isNewSearch: boolean = false) => {
        try {
            if (isNewSearch) setLoading(true); else setLoadingMore(true);
            const limit = 12;
            const response = await urlService.getAll(pageNum, limit, search);

            const mappedLinks = (response.data as RawUrlItem[]).map((item) => ({
                id: item._id,
                shortUrl: `${import.meta.env.VITE_SHORT_URL_BASE || 'litbee.io'}/${item.shortCode}`,
                longUrl: item.longUrl,
                clicks: item.clicks,
                icon: "⚡",
                tags: item.tags || [],
            }));

            if (isNewSearch) {
                setLinks(mappedLinks);
                setHasMore(mappedLinks.length < response.count);
                setPage(1);
            } else {
                setLinks(prev => {
                    const newList = [...prev, ...mappedLinks];
                    setHasMore(newList.length < response.count);
                    return newList;
                });
            }
            setTotal(response.count);
        } catch (err: unknown) {
            console.error("Failed to fetch links:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchLinks(1, debouncedSearch, true);
    }, [debouncedSearch]);

    useEffect(() => {
        if (loading || loadingMore || !hasMore) return;

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => {
                    const next = prev + 1;
                    fetchLinks(next, debouncedSearch);
                    return next;
                });
            }
        };

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });

        if (lastLinkElementRef.current) {
            observer.current.observe(lastLinkElementRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, loadingMore, hasMore, debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Failed to logout on server", error);
        } finally {
            dispatch(logout());
            navigate("/auth");
        }
    };

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreateLink = async (data: { longUrl: string, customSlug?: string }) => {
        setIsSubmitLoading(true);
        try {
            const response = await urlService.create({ longUrl: data.longUrl, customSlug: data.customSlug || undefined, tags });
            const newItem: LinkItem = {
                id: response.data._id,
                shortUrl: `${import.meta.env.VITE_SHORT_URL_BASE || 'litbee.io'}/${response.data.shortCode}`,
                longUrl: response.data.longUrl,
                clicks: 0,
                icon: "⚡",
                tags: response.data.tags || [],
            };
            setLinks([newItem, ...links]);
            setTotal(prev => prev + 1);
            setIsCreateModalOpen(false);
            setSuccessData({ short: newItem.shortUrl, long: newItem.longUrl });
            setIsSuccessModalOpen(true);
            setLongUrl(""); setCustomSlug(""); setTags([]);
        } catch (err: unknown) {
            const message = isAxiosError(err) ? err.response?.data?.message : "Failed to create link";
            alert(message || "Failed to create link");
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleEditLink = async (data: { longUrl: string, customSlug?: string }) => {
        if (!selectedLink) return;
        setIsSubmitLoading(true);
        try {
            const response = await urlService.update(selectedLink.id, { longUrl: data.longUrl, customSlug: data.customSlug || undefined, tags });
            const updatedItem: LinkItem = {
                ...selectedLink,
                longUrl: response.data.longUrl,
                shortUrl: `${import.meta.env.VITE_SHORT_URL_BASE || 'litbee.io'}/${response.data.shortCode}`,
                tags: response.data.tags || [],
            };
            setLinks(links.map(l => l.id === selectedLink.id ? updatedItem : l));
            setIsEditModalOpen(false);
            setLongUrl(""); setCustomSlug(""); setTags([]);
        } catch (err: unknown) {
            const message = isAxiosError(err) ? err.response?.data?.message : "Failed to update link";
            alert(message || "Failed to update link");
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleDeleteLink = async () => {
        if (!selectedLink) return;
        try {
            await urlService.delete(selectedLink.id);
            setLinks(links.filter(l => l.id !== selectedLink.id));
            setTotal(prev => prev - 1);
            setIsDeleteModalOpen(false);
        } catch (err: unknown) {
            const message = isAxiosError(err) ? err.response?.data?.message : "Failed to delete link";
            alert(message || "Failed to delete link");
        }
    };

    const openEdit = (link: LinkItem) => {
        setSelectedLink(link);
        setLongUrl(link.longUrl);
        setCustomSlug(link.shortUrl.replace(`${import.meta.env.VITE_SHORT_URL_BASE || 'litbee.io'}/`, ""));
        setTags(link.tags || []);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#0a0a0a] font-sans overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LitbeeLogo size={32} />
                        <span className="font-black text-lg tracking-tight">Litbee.io</span>
                    </div>

                    <div className="flex-1 max-w-md mx-8 relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search URLs by URL, slug, or tag"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-colors placeholder:text-gray-400 text-gray-900"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setLongUrl(""); setCustomSlug(""); setTags([]);
                                setIsCreateModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            New link
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                <div className="w-9 h-9 bg-amber-100 border border-amber-200 text-amber-900 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "User"}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                                    </div>
                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings size={16} /> Settings
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-6 py-10 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black">My Links</h1>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200">
                        {total} total
                    </span>
                </div>

                {loading && links.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900">No links found</h3>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {links.map((link, index) => (
                                <div
                                    key={link.id}
                                    ref={index === links.length - 1 ? lastLinkElementRef : null}
                                    className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between hover:border-amber-400/30 transition-all group shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sm border border-slate-100">{link.icon}</div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                            <ArrowUpRight size={14} className="text-gray-400" /> {link.clicks} clicks
                                        </div>
                                    </div>
                                    <div className="mb-6 w-full min-w-0">
                                        <h3 className="font-bold text-[17px] mb-1.5 text-gray-900 flex items-center gap-2 w-full overflow-hidden">
                                            <span className="truncate" title={link.shortUrl}>{link.shortUrl}</span>
                                            {link.expired && <span className="text-xs text-red-500 font-medium px-1.5 py-0.5 bg-red-50 rounded flex-shrink-0">Expired</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate w-full" title={link.longUrl}>{link.longUrl}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            {link.tags?.map((tag, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${tag.color}`} /> {tag.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleCopy(link.shortUrl, link.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 transition-colors">
                                                {copiedId === link.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            </button>
                                            <button onClick={() => { setSelectedLink(link); setIsQrModalOpen(true); }} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900">
                                                <QrCode size={14} />
                                            </button>
                                            <button onClick={() => openEdit(link)} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900">
                                                <PenIcon size={14} />
                                            </button>
                                            <button onClick={() => { setSelectedLink(link); setIsDeleteModalOpen(true); }} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {loadingMore && (
                            <div className="flex justify-center py-10">
                                <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </>
                )}
            </main>

            <LinkModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateLink}
                title="Create new link"
                buttonText="Shorten"
                longUrl={longUrl} setLongUrl={setLongUrl}
                customSlug={customSlug} setCustomSlug={setCustomSlug}
                tags={tags} setTags={setTags}
                isSubmitLoading={isSubmitLoading}
            />

            <LinkModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditLink}
                title="Edit link"
                buttonText="Save Changes"
                longUrl={longUrl} setLongUrl={setLongUrl}
                customSlug={customSlug} setCustomSlug={setCustomSlug}
                tags={tags} setTags={setTags}
                excludeId={selectedLink?.id}
                isSubmitLoading={isSubmitLoading}
            />

            <LinkSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                shortUrl={successData?.short || ""}
                longUrl={successData?.long || ""}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteLink}
                shortUrl={selectedLink?.shortUrl || ""}
            />

            <QrModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                shortUrl={selectedLink?.shortUrl || ""}
            />
        </div>
    );
}
