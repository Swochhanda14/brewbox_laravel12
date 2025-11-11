import React, { useState } from 'react'
import Banner from '../components/Banner'

const ContactUsPage = (props) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <>
      <Banner title={props.title || 'Contact Us'} />
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-800">Contact Us</h1>
      <p className="mb-6 text-gray-700">Have a question, suggestion, or just want to say hello? Fill out the form below and our team will get back to you soon!</p>
      {submitted ? (
        <div className="text-green-700 font-semibold">Thank you for contacting us! We'll respond as soon as possible.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required className="w-full border rounded px-3 py-2 min-h-[100px]" />
          </div>
          <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">Send</button>
        </form>
      )}
    </div>
    </>
  )
}

export default ContactUsPage
