import { useState } from 'react';
import { Users, Download } from 'lucide-react';

const CommercialContactsTab = ({ asset, contactsDatabase }) => {
  const [exportingCSV, setExportingCSV] = useState(false);

  // Get full contact details for this asset
  const assetContacts = asset.commercialContacts || [];

  const contactDetails = assetContacts
    .map(contactRef => {
      const contact = contactsDatabase.find(c => c.id === contactRef.contactId);
      if (!contact) {
        console.warn(`Contact ${contactRef.contactId} not found in database`);
        return null;
      }
      return {
        ...contact,
        relevance: contactRef.relevance
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.relevance - a.relevance); // Sort by relevance (highest first)

  // Export to CSV
  const exportToCSV = () => {
    setExportingCSV(true);

    // CSV headers
    const headers = ['Name', 'Title', 'Company', 'Location', 'Type', 'Relevance', 'Note'];

    // CSV rows
    const rows = contactDetails.map(contact => [
      contact.name,
      contact.title,
      contact.company,
      contact.location,
      contact.contactType,
      contact.relevance,
      contact.relevanceNote
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${asset.id}_commercial_contacts.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExportingCSV(false), 500);
  };

  if (contactDetails.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No commercial contacts identified for this asset yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with export button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold font-serif">Commercial Contacts</h3>
          <p className="text-sm text-gray-600 mt-1">
            {contactDetails.length} relevant industry contacts sorted by relevance
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={exportingCSV}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 text-sm transition-colors"
        >
          <Download size={16} />
          {exportingCSV ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>

      {/* Contact cards */}
      <div className="space-y-4">
        {contactDetails.map(contact => (
          <div
            key={contact.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              {/* Contact info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-base">{contact.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    contact.relevance >= 90 ? 'bg-green-100 text-green-800' :
                    contact.relevance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.relevance}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-1">{contact.title}</p>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {contact.company} &bull; {contact.location}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {contact.contactType}
                  </span>
                </div>

                <p className="text-sm text-gray-600 italic">
                  {contact.relevanceNote}
                </p>
              </div>

              {/* Relevance score visualization */}
              <div className="ml-4 text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {contact.relevance}
                </div>
                <div className="text-xs text-gray-500">Relevance</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Contacts are ranked by relevance based on application cluster alignment,
          company focus areas, and asset characteristics. Higher scores indicate stronger potential fit.
          Use "Export to CSV" to save contact list for outreach planning.
        </p>
      </div>
    </div>
  );
};

export default CommercialContactsTab;
