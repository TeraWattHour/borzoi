export const IS_DEV = () => {
    const env = process.env.NODE_ENV;

    if (env && env.includes('dev')) {
        return true;
    }

    return false;
};
