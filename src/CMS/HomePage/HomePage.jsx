const HomePage = ({ siteData }) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{siteData?.siteName}</h1>
        <p className="text-gray-600 mb-4">{siteData?.description}</p>

        {siteData?.announcements && siteData.announcements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
              Announcements
            </h2>
            <div className="space-y-4">
              {siteData.announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
