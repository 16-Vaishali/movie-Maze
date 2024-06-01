import Navbar from "@/components/Navbar";
import Moviecard from "@/components/Moviecard";
import Search from "@/components/Search";
import movies from "@/data/dummyData";
export default function Home() {
  return (
    <div style={{ background: '#090e2b' }}>
      <Navbar />
      <Search  />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mx-4">
        {
          movies.map((movie, index) => (
            <Moviecard 
              key={index} 
              title={movie.title} 
              year={movie.year} 
              imageUrl={movie.url} dummy={true}
            />
          ))
        }
      </div>
    </div>
  );
}
