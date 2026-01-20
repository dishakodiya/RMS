export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      <div className="container-fluid">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Resource Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
