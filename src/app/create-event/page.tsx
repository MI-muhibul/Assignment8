"use client";

import { EventForm } from "@/components/EventForm";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function CreateEventPage() {
  return <ProtectedPage><section className="page-wrap form-layout"><div className="page-heading"><span className="eyebrow">MAKE A LITTLE GOOD HAPPEN</span><h1>Bring people<br /><em>together.</em></h1><p>Share what you have in mind. Your neighbors will take it from there.</p></div><EventForm /></section></ProtectedPage>;
}
