const generateUniqueSlug = async (title, Model) => {
    // 1. Create base slug
    let slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '') // Remove special characters
        .replace(/ +/g, '-');    // Replace spaces with hyphens

    // 2. Check for existence
    let slugExists = await Model.findOne({ slug });

    if (!slugExists) return slug;

    // 3. If exists, append unique suffix
    let counter = 1;
    while (slugExists) {
        const newSlug = `${slug}-${counter}`;
        slugExists = await Model.findOne({ slug: newSlug });
        if (!slugExists) return newSlug;
        counter++;
    }
};
module.exports = {
    generateUniqueSlug,
};