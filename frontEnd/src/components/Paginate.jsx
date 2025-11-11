import { Link } from 'react-router-dom';

const Paginate = ({ pages, page,title, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center my-6">
        <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
          {[...Array(pages).keys()].map((x) => {
            const currentPage = x + 1;
            const path = !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${currentPage}`
                : `/page/${currentPage}`
              : `/admin/productlist/${currentPage}`;

            const isActive = currentPage === page;

            return (
              <Link
                key={currentPage}
                to={path}
                className={`px-4 py-2 border text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {currentPage}
              </Link>
            );
          })}
        </nav>
      </div>
    )
  );
};

export default Paginate;
