"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  DollarSign,
  FileText,
  ChevronRight,
  UserCheck,
  Award,
  X,
  CheckCircle2,
  Save,
} from "lucide-react";
import type { AdminClient, ConsultationRecord, OrderRecord } from "@/types";

interface ClientsManagerProps {
  consultations: ConsultationRecord[];
  orders: OrderRecord[];
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  consultations,
  orders,
}) => {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(
    null,
  );
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [clientNotes, setClientNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute Client Stats
  const stats = useMemo(() => {
    const total = clients.length;
    const totalRev = clients.reduce(
      (acc, c) => acc + (c.total_spend_pkr || 0),
      0,
    );
    const avgLtv = total > 0 ? Math.round(totalRev / total) : 0;
    const repeatClients = clients.filter(
      (c) => c.total_consultations + c.total_orders > 1,
    ).length;
    const repeatRate =
      total > 0 ? Math.round((repeatClients / total) * 100) : 0;

    return { total, totalRev, avgLtv, repeatRate };
  }, [clients]);

  // Filtered clients list
  const filteredClients = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        (c.company && c.company.toLowerCase().includes(query)),
    );
  }, [clients, searchTerm]);

  // Open client details
  const handleOpenClient = (client: AdminClient) => {
    setSelectedClient(client);
    setClientNotes(client.notes || "");
    setSaveSuccess(false);
  };

  // Save notes
  const handleSaveNotes = () => {
    if (!selectedClient) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id ? { ...c, notes: clientNotes } : c,
      ),
    );
    setSelectedClient((prev) =>
      prev ? { ...prev, notes: clientNotes } : null,
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Add client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;

    const created: AdminClient = {
      id: `cli_${Date.now()}`,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || "+92 300 0000000",
      company: newClient.company || null,
      notes: newClient.notes || null,
      total_consultations: 0,
      total_orders: 0,
      total_spend_pkr: 0,
      last_activity_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };

    setClients([created, ...clients]);
    setNewClient({ name: "", email: "", phone: "", company: "", notes: "" });
    setIsAddingClient(false);
    setSelectedClient(created);
  };

  // Consultations for currently selected client
  const clientConsultations = useMemo(() => {
    if (!selectedClient) return [];
    return consultations.filter(
      (c) =>
        c.client_email.toLowerCase() === selectedClient.email.toLowerCase() ||
        c.client_name.toLowerCase() === selectedClient.name.toLowerCase(),
    );
  }, [consultations, selectedClient]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Client Relations & Accounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Client Directory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage patrons, commission records, consultation history, and
            lifetime client engagement.
          </p>
        </div>
        <button
          onClick={() => setIsAddingClient(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-sm rounded-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Record</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Total Patrons
            </span>
            <div className="p-2 bg-stone-50 rounded-sm text-stone-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {stats.total}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Active architectural clients
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Client Lifetime Value
            </span>
            <div className="p-2 bg-emerald-50 rounded-sm text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            PKR {stats.avgLtv.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-mono">
            Average spend per client
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Total Volume
            </span>
            <div className="p-2 bg-amber-50 rounded-sm text-[#7E5714]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            PKR {(stats.totalRev / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Combined billing across clients
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Repeat Rate
            </span>
            <div className="p-2 bg-indigo-50 rounded-sm text-indigo-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {stats.repeatRate}%
          </div>
          <div className="text-[11px] text-indigo-600 mt-1 font-mono">
            Multiple commissions
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-stone-200 p-3 rounded-sm shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client name, email, phone number, or company..."
          className="w-full text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-stone-400 hover:text-stone-600 text-xs px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-mono">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Consultations</th>
                <th className="py-3 px-4 text-center">Design Orders</th>
                <th className="py-3 px-4 text-right">Total Billing</th>
                <th className="py-3 px-4">Last Engagement</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredClients.map((client) => {
                const initials = client.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={client.id}
                    onClick={() => handleOpenClient(client)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-serif text-stone-700 shrink-0 font-medium">
                          {initials}
                        </div>
                        <div>
                          <p className="font-serif text-stone-900 group-hover:text-[#7E5714] font-medium transition-colors">
                            {client.name}
                          </p>
                          {client.company && (
                            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              {client.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                      <div>{client.email}</div>
                      <div className="text-stone-400 mt-0.5">
                        {client.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                        {client.total_consultations}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                        {client.total_orders}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-stone-900">
                      PKR {client.total_spend_pkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                      {client.last_activity_date || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClient(client);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7E5714] hover:text-[#684710] py-1 px-2.5 hover:bg-amber-50 rounded transition-colors"
                      >
                        Profile
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    {searchTerm
                      ? `No client records match "${searchTerm}".`
                      : "No client records registered yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex items-start justify-between bg-stone-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100/60 border border-amber-300 text-stone-800 font-serif font-medium text-base flex items-center justify-center">
                  {selectedClient.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-serif text-stone-900">
                    {selectedClient.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedClient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedClient.phone}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 border border-stone-200 rounded-sm text-center">
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    Total Spend
                  </div>
                  <div className="text-base font-serif font-semibold text-stone-900 mt-0.5">
                    PKR {selectedClient.total_spend_pkr.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    Consultations
                  </div>
                  <div className="text-base font-serif font-semibold text-stone-900 mt-0.5">
                    {selectedClient.total_consultations}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    Design Packages
                  </div>
                  <div className="text-base font-serif font-semibold text-stone-900 mt-0.5">
                    {selectedClient.total_orders}
                  </div>
                </div>
              </div>

              {/* Private Studio Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#7E5714]" />
                    Architectural Notes & Project Preferences
                  </label>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                </div>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  rows={4}
                  placeholder="Record client aesthetic tastes, plot locations, architectural briefs, or special requirements..."
                  className="w-full text-xs font-sans text-stone-800 p-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Consultation History */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-600 mb-3">
                  Consultation Booking History ({clientConsultations.length})
                </h4>
                {clientConsultations.length > 0 ? (
                  <div className="space-y-2">
                    {clientConsultations.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-serif text-stone-900 font-medium">
                            {c.tier_name}
                          </div>
                          <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                            {c.booking_date} at {c.booking_time} (
                            {c.duration_minutes}m)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-stone-900 font-medium">
                            PKR {c.price_pkr.toLocaleString()}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded-full mt-1 ${
                              c.payment_status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {c.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-stone-200 rounded-sm text-center text-xs text-stone-400">
                    No consultation sessions logged for this email address yet.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <a
                href={`mailto:${selectedClient.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Client
              </a>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-serif text-stone-900 font-medium">
                Add New Client Record
              </h3>
              <button
                onClick={() => setIsAddingClient(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateClient}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  placeholder="e.g. Faisal Khan"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  placeholder="faisal.k@example.com"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  placeholder="+92 300 1234567"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) =>
                    setNewClient({ ...newClient, company: e.target.value })
                  }
                  placeholder="e.g. Prime Developers"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Initial Notes
                </label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) =>
                    setNewClient({ ...newClient, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Project intentions, referral source, etc."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingClient(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white font-medium rounded-sm transition-colors"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
