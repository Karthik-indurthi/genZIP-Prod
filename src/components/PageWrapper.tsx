const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm min-h-[85vh]">
      {children}
    </div>
  );
  
  export default PageWrapper;
  