export const isObject = (val: any): boolean => val !== null && typeof val === 'object';

export const isValidUrl = (url: string) => {
    try {
        new URL(url);

        return true;
    } catch (e) {
        return false;
    }
};
