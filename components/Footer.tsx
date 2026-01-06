export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center text-sm text-zinc-400">
        <p className="mb-2">
          © {new Date().getFullYear()} L4 – Level Four Rooftop Restaurant
        </p>
        <p>Power House Quarter Complex, Dharmanagar, Tripura</p>
      </div>
    </footer>
  );
}
