'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type FieldKey = 'firstName' | 'lastName' | 'email' | 'phone';

const SKELETON = (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ef5c5c] border-t-transparent rounded-full animate-spin" />
    </div>
);

const STORAGE_KEY = 'profile:fields';

const DEFAULT_FIELDS = {
    firstName: 'manyata',
    lastName: 'roka',
    email: 'manyata@gmail.com',
    phone: '+977 9800000000',
};

type Fields = typeof DEFAULT_FIELDS;

function loadFields(): Fields {
    try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<Fields>;
            return { ...DEFAULT_FIELDS, ...parsed };
        }
    } catch (_) {}
    return DEFAULT_FIELDS;
}

export default function ProfilePage() {
    const router = useRouter();
    const [fields, setFields] = useState<Fields>(DEFAULT_FIELDS);
    const [editing, setEditing] = useState(false);
    const [style, setStyle] = useState('Handmade Beaded');
    const PHOTO_KEY = 'profile:photo';
    const [photo, setPhoto] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const didRun = useRef(false);

    useEffect(() => {
        setMounted(true);

        if (didRun.current) return;
        didRun.current = true;

        let ok = false;
        try {
            ok = typeof window !== 'undefined'
                && !!sessionStorage.getItem('isLoggedIn');
            if (ok) setFields(loadFields());
            try {
                const p = localStorage.getItem(PHOTO_KEY);
                if (p) setPhoto(p);
            } catch (_) {}
        } catch (_) {
            ok = false;
        }

        if (!ok) {
            // Defer redirect one frame so StrictMode cleanup cancels it cleanly
            const t = window.setTimeout(() => {
                window.location.href = '/login';
            }, 0);
            return () => window.clearTimeout(t);
        }
        return undefined;
    }, [router]);

    if (!mounted) {
        return SKELETON;
    }

    const updateField = (k: FieldKey, v: string) => {
        setFields((prev) => {
            const next = { ...prev, [k]: v };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch (_) {}
            return next;
        });
    };

    const handleFile = (file?: File | null) => {
        if (!file) return;
        const r = new FileReader();
        r.onload = () => {
            const result = typeof r.result === 'string' ? r.result : null;
            if (result) {
                try {
                    localStorage.setItem(PHOTO_KEY, result);
                } catch (_) {}
                setPhoto(result);
            }
        };
        r.readAsDataURL(file);
    };

    const onChangePhotoClick = () => {
        fileRef.current?.click();
    };

    const clearPhoto = () => {
        try { localStorage.removeItem(PHOTO_KEY); } catch(_) {}
        setPhoto(null);
    };

    return (
        <div className="pb-20 px-4 sm:px-6 pt-0 bg-linear-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="mx-auto max-w-2xl w-full">
                <div className="grid grid-cols-1 gap-4">
                    {/* Personal Information & Change Password */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                            <h1 className="text-sm sm:text-lg font-bold leading-tight text-center sm:text-left text-[#1A1A1A]">
                                Personal<br />Information
                            </h1>
                            <button
                                type="button"
                                onClick={() => {
                                    if (editing) {
                                        try {
                                            localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
                                        } catch (_) {}
                                    }
                                    setEditing((v) => !v);
                                }}
                                className="self-center sm:self-start h-11 px-7 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white font-bold text-lg transition-colors"
                            >
                                {editing ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-28 h-28 rounded-full border-4 border-orange-100 flex items-center justify-center text-3xl font-bold text-[#ef5c5c] bg-white overflow-hidden">
                                    {photo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(fields.firstName && fields.firstName[0]?.toUpperCase()) || 'U'}</span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                                    <button
                                        type="button"
                                        onClick={onChangePhotoClick}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white font-semibold"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" stroke="#fff" />
                                            <circle cx="12" cy="13" r="4" stroke="#fff" />
                                        </svg>
                                        Change Photo
                                    </button>
                                    {photo ? (
                                        <button type="button" onClick={clearPhoto} className="mt-2 text-sm text-[#64748B]">
                                            Remove
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Field label="First Name" value={fields.firstName} editable={editing} onChange={(v) => updateField('firstName', v)} />
                                <Field label="Last Name" value={fields.lastName} editable={editing} onChange={(v) => updateField('lastName', v)} />
                                <Field label="Email" value={fields.email} editable={editing} onChange={(v) => updateField('email', v)} type="email" />
                                <Field label="Phone" value={fields.phone} editable={editing} onChange={(v) => updateField('phone', v)} type="tel" />
                            </div>

                            {editing ? (
                                <div className="mt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fields)); } catch(_) {}
                                            setEditing(false);
                                        }}
                                        className="flex-1 h-12 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white font-bold"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // revert
                                            setFields(loadFields());
                                            try { const p = localStorage.getItem(PHOTO_KEY); if (p) setPhoto(p); } catch(_) {}
                                            setEditing(false);
                                        }}
                                        className="flex-1 h-12 rounded-full border border-black/5 bg-white text-[#64748B] font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : null}

                            <div className="pt-8 mt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <h2 className="text-sm sm:text-lg font-bold text-center mb-6 text-[#1A1A1A]">
                                    Change Password
                                </h2>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        className="h-12 px-10 rounded-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    value,
    editable,
    onChange,
    type = 'text',
}: {
    label: string;
    value: string;
    editable: boolean;
    onChange: (v: string) => void;
    type?: 'text' | 'email' | 'tel';
}) {
    return (
        <div>
            <label className="block text-[#1A1A1A] font-semibold text-base mb-3">
                {label}
            </label>
            <input
                type={type}
                value={value}
                readOnly={!editable}
                onChange={(e) => onChange(e.target.value)}
                className={
                    "w-full h-12 rounded-xl border border-black/5 px-4 text-[#1A1A1A] transition-colors " +
                    (editable
                        ? "bg-white focus:outline-none"
                        : "bg-[#F9FAFB] text-[#64748B] cursor-not-allowed")
                }
                style={{ borderColor: editable ? '#0000000D' : '#0000000D' }}
                onFocus={(e) => { if (editable) e.currentTarget.style.borderColor = '#ef5c5c'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#0000000D'; }}
            />
        </div>
    );
}
