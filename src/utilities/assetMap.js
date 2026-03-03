const assets = import.meta.glob('/src/assets/**/*.{png,jpg,svg}', { eager: true });

export const assetMap = Object.fromEntries(
  Object.entries(assets).map(([path, module]) => {
    const cleanKey = path
      .replace('/src/assets/', '')
    return [cleanKey, module.default];
  })
);