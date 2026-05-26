export const getBaseUrl = () => {
    try { return import.meta.env?.VITE_API_URL || 'http://localhost:8000'; }
    catch(_) { return 'http://localhost:8000'; }
};

export const photoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Ensure url starts with /
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${getBaseUrl()}${path}`;
};

export const getMainPhoto = (profile) => {
    if (!profile) return null;
    const main = profile.photos?.find(p => p.is_main) || profile.photos?.[0];
    const url = main?.url || profile.photo || profile.avatar || null;
    return photoUrl(url);
};

export const calcAge = (birthday) => {
    if (!birthday) return null;
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};
