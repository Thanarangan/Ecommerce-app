import { useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { addSellerProduct } from '../services/sellerService'
import { getApiErrorMessage } from '../utils/errors'

export function SellerAddProductPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    description: '',
    name: '',
    price: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!imageFile) {
      setError('Please choose an image file for the product.')
      return
    }

    setSubmitting(true)

    try {
      await addSellerProduct({ ...form, imageFile })
      navigate('/seller', {
        replace: true,
        state: { successMessage: 'Product added successfully' },
      })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to add product.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Seller</p>
          <h1>Add product</h1>
          <p>Create a new product listing for your seller account.</p>
        </div>
      </section>

      <form className="summary-panel" onSubmit={handleSubmit}>
        <label className="field">
          <span>Product name</span>
          <div className="field__control">
            <input
              name="name"
              required
              type="text"
              value={form.name}
              onChange={updateField}
            />
          </div>
        </label>

        <label className="field">
          <span>Description</span>
          <div className="field__control">
            <input
              name="description"
              required
              type="text"
              value={form.description}
              onChange={updateField}
            />
          </div>
        </label>

        <label className="field">
          <span>Price</span>
          <div className="field__control">
            <input
              min="1"
              name="price"
              required
              step="0.01"
              type="number"
              value={form.price}
              onChange={updateField}
            />
          </div>
        </label>

        <label className="field">
          <span>Product image</span>
          <div className="field__control">
            <Upload size={18} />
            <input
              accept="image/*"
              required
              type="file"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
          </div>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary" disabled={submitting} type="submit">
          {submitting ? <Loader2 size={18} /> : <Upload size={18} />}
          Save product
        </button>
      </form>
    </div>
  )
}
