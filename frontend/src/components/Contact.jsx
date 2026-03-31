import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";

const Contact = () => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url('https://images.pexels.com/photos/3183167/pexels-photo-3183167.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="surface-card z-10 grid w-full max-w-5xl gap-8 p-8 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
            Contact
          </span>
          <h1 className="section-heading mb-4">Let’s talk.</h1>
          <p className="section-subtext mb-8">
            We would love to hear from you. Reach out for orders, partnerships, or product questions.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <LuPhone className="text-indigo-600" />
              <span>+4 8961 9441 499</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <LuMail className="text-indigo-600" />
              <span>anshrajshukla.official@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <LuMapPin className="text-indigo-600" />
              <span>123 MainTown, Usa</span>
            </div>
          </div>
        </div>

        <form className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Send a message</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input type="text" required className="form-input" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input type="email" required className="form-input" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea rows="4" required className="form-input resize-none" />
            </div>

            <button className="btn-primary w-full">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
