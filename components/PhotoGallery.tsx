import React from 'react';

const PhotoGallery: React.FC = () => {
    // Placeholder stock images for village vibe
    const images = [
        { url: "https://images.unsplash.com/photo-1623157745772-e427eb326300?auto=format&fit=crop&q=80&w=400&h=300", title: "ગ્રામ પંચાયત" },
        { url: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=400&h=300", title: "ગામનું પાદર" },
        { url: "https://images.unsplash.com/photo-1599581843324-7e77747e0996?auto=format&fit=crop&q=80&w=400&h=300", title: "ખેતીવાડી" },
        { url: "https://images.unsplash.com/photo-1627920769835-263d50044579?auto=format&fit=crop&q=80&w=400&h=300", title: "મંદિર" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-1.5 bg-indigo-500 rounded-full"></span>
                <h3 className="text-xl font-bold text-gray-800">ગામની ઝાંખી (Photo Gallery)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden shadow-md border border-gray-100 cursor-pointer">
                        <img 
                            src={img.url} 
                            alt={img.title} 
                            className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs font-bold text-center">{img.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PhotoGallery;