import React, { useState, useEffect } from 'react';

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports on component mount
  useEffect(() => {
    if (!isBrowser()) return;

    const fetchReports = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, you would fetch from an API
        const mockReports = [
          {
            id: 1,
            title: "Complete Blood Count",
            date: "2023-08-15",
            doctor: "Dr. Emily Chen",
            type: "Laboratory",
            status: "Normal"
          },
          {
            id: 2,
            title: "Chest X-Ray Report",
            date: "2023-07-22",
            doctor: "Dr. James Wilson",
            type: "Radiology",
            status: "Normal"
          },
          {
            id: 3,
            title: "Lipid Profile",
            date: "2023-06-10",
            doctor: "Dr. Emily Chen",
            type: "Laboratory",
            status: "Abnormal"
          },
          {
            id: 4,
            title: "Cardiac Stress Test",
            date: "2023-05-05",
            doctor: "Dr. Sarah Johnson",
            type: "Cardiology",
            status: "Normal"
          }
        ];
        
        setReports(mockReports);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports. Please try again later.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Server-side rendering safe rendering
  if (!isBrowser()) {
    return (
      <div className="min-h-screen animate-pulse bg-gray-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Loading Medical Reports...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 gradient-text">Medical Reports</h1>
        <button className="btn-primary">
          <span className="mr-1">+</span> New Report
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div 
              key={report.id} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover-lift"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500">Date: {report.date}</p>
                  <p className="text-sm text-gray-500">Doctor: {report.doctor}</p>
                </div>
                <div>
                  <span className={`badge ${report.status === 'Normal' ? 'badge-success' : 'badge-warning'}`}>
                    {report.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="btn-sm btn-outline">View Report</button>
                <button className="btn-sm btn-secondary">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="font-medium">Laboratory</div>
            <div className="text-sm text-gray-500">Blood tests, urine analysis</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="font-medium">Radiology</div>
            <div className="text-sm text-gray-500">X-rays, MRIs, CT scans</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="font-medium">Cardiology</div>
            <div className="text-sm text-gray-500">ECGs, stress tests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage; 