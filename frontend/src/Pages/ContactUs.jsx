import { Home, Mail, Phone } from "lucide-react";
import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-r h-screen from-indigo-100 from-10% via-sky-200 via-30% to-emerald-100">
      <h1 className="text-3xl text-center  text-blue-600 font-semibold">
        Contact Us
      </h1>
      <div className="flex justify-center items-center gap-x-40 w-full h-96 mt-20">
        <div className="flex justify-center items-center shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3811.4661085104526!2d78.59465581078462!3d17.196163183590578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba659868b4727%3A0xf39a771705e23170!2sCVR%20College%20Of%20Engineering!5e0!3m2!1sen!2sin!4v1738898607085!5m2!1sen!2sin"
            width="600"
            height="450"
            // style="border:0;"
            // allowfullscreen=""
            loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="mr-10 leading-6 drop-shadow-lg">
          <div className="flex justify-center items-center gap-20">
            <Home color="#00b3ff" />
            <p>
              CVR College of Engineering<br></br>
              Vastunagar,Ibrahimpatnam<br></br>
              Hyderabad,Telangana,501510.
            </p>
          </div>
          <hr className="bg-slate-400 h-[1px] mt-4" />
          <div className="flex justify-start items-center gap-20 mt-10">
            <Phone color="#00b3ff" />
            <div>
              Call us<br></br>
              <p className="underline underline-offset-1 cursor-pointer hover:text-blue-600">
                +91 8367661141
              </p>
            </div>
          </div>
          <hr className="bg-slate-400 h-[1px] mt-4" />
          <div className="flex justify-center items-center gap-20 mt-10">
            <Mail color="#00b3ff" />
            <div>
              For any further related queries<br></br>
              Email us at<br></br>
              <p className="underline underline-offset-1 cursor-pointer hover:text-blue-600">
                cvrhospitals@gmail.com
              </p>
            </div>
          </div>
          <hr className="bg-slate-400 h-[1px] mt-4" />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
