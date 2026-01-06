import React from "react";

export function AssetReviewer({ selectedAsset }) {
  return (
    <main style={{ flex: 1, padding: 24 }}>
      {selectedAsset ? (
        <div>
          <h2 style={{ margin: 0, marginBottom: 8 }}>{selectedAsset.title}</h2>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
            {selectedAsset.kind}
          </div>
          {selectedAsset.description && (
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333' }}>
              {selectedAsset.description}
            </p>
          )}
        </div>
      ) : (
        <div style={{ color: '#999' }}>Select an asset to view details</div>
      )}
    </main>
  );
}
