// src/app/components/footer.tsx
const Footer = () => {
    return (
      <footer className="w-full bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} XRP Rich List Summary. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://x.com/xrp_rich_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-blue-500 transition-colors"
                aria-label="Follow me on X"
              >
                <svg 
                  className="w-5 h-5" 
                  viewBox="0 0 1200 1227" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;