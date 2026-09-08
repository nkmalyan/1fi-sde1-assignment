export default function VariantSelector({ variants, selectedVariant, onSelect }) {
  const storages = [...new Set(variants.map((v) => v.storage))];
  const colorsForStorage = variants.filter(
    (v) => v.storage === selectedVariant.storage
  );

  function handleStorageChange(storage) {
    const match =
      variants.find(
        (v) => v.storage === storage && v.color === selectedVariant.color
      ) || variants.find((v) => v.storage === storage);
    onSelect(match);
  }

  return (
    <div className="space-y-5">
      {storages.length > 1 && (
        <div>
          <p className="text-[13px] font-semibold text-muted mb-2">Storage</p>
          <div className="flex gap-2 flex-wrap">
            {storages.map((storage) => {
              const active = storage === selectedVariant.storage;
              return (
                <button
                  key={storage}
                  onClick={() => handleStorageChange(storage)}
                  className={`px-4 py-2 rounded-xl text-[13.5px] font-semibold border transition-colors ${
                    active
                      ? "border-brand bg-brand-light text-brand"
                      : "border-line bg-white text-ink hover:border-brand/40"
                  }`}
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-[13px] font-semibold text-muted mb-2">
          Color &middot; {selectedVariant.color}
        </p>
        <div className="flex gap-3">
          {colorsForStorage.map((v) => {
            const active = v.id === selectedVariant.id;
            return (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                aria-label={v.color}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  active ? "border-brand scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: v.colorHex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
