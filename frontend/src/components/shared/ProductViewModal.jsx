import { Dialog } from '@headlessui/react'
import { MdDone, MdClose } from 'react-icons/md'

const Status = ({ text, icon: Icon, bg, color }) => (
  <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${bg} ${color}`}>
    <Icon className="h-4 w-4" /> {text}
  </span>
)
 
const Divider = () => <hr className="my-3 border-t border-gray-200" />

function ProductViewModal({ open, setOpen, product, isAvailable }) {
  if (!open || !product || typeof product !== 'object') return null

  const {
    productName,
    image,
    description,
    price,
    specialPrice,
  } = product

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-lg overflow-hidden bg-white shadow-xl">
        {image && (
          <div className="aspect-3/2 bg-gray-100">
            <img className="w-full h-full object-cover" src={image} alt={productName} />
          </div>
        )}
        <div className="px-6 pt-6 pb-4">
          <h1 className="lg:text-3xl sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4">{productName}</h1>

          <div className="space-y-2 text-gray-700 pb-4">
            <div className="flex items-center justify-between gap-2">
              {specialPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">${Number(price).toFixed(2)}</span>
                  <span className="sm:text-xl font-semibold text-slate-700">${Number(specialPrice).toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-xl font-bold">${Number(price).toFixed(2)}</span>
              )}

              {isAvailable ? (
                <Status text="In Stock" icon={MdDone} bg="bg-teal-200" color="text-teal-900" />
              ) : (
                <Status text="Out-Of-Stock" icon={MdClose} bg="bg-rose-200" color="text-rose-700" />
              )}
            </div>

            <Divider />

            <p>{description}</p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ProductViewModal;