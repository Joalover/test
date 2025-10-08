import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePersistentWorksheet } from './usePersistentState';
import { FailureIdea, PreventiveAction } from './types';
import { nanoid } from './utils';

const App = () => {
  const { data, setData, save, reset } = usePersistentWorksheet();
  const worksheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleHeaderChange = (field: 'projectTitle' | 'dateTime' | 'facilitator' | 'participants', value: string) => {
    setData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const handleSuccessSnapshotChange = (index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      successSnapshot: prev.successSnapshot.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleCatastropheHeadlineChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      catastropheHeadline: value,
    }));
  };

  const handleFailureChange = (id: string, updates: Partial<FailureIdea>) => {
    setData((prev) => ({
      ...prev,
      brainstormFailures: prev.brainstormFailures.map((failure) =>
        failure.id === id
          ? {
              ...failure,
              ...updates,
            }
          : failure
      ),
    }));
  };

  const addFailure = () => {
    setData((prev) => ({
      ...prev,
      brainstormFailures: [
        ...prev.brainstormFailures,
        { id: nanoid(), text: '', checked: false },
      ],
    }));
  };

  const removeFailure = (id: string) => {
    setData((prev) => ({
      ...prev,
      brainstormFailures: prev.brainstormFailures.filter((failure) => failure.id !== id),
    }));
  };

  const handleTopRiskChange = (index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      topRisks: prev.topRisks.map((risk, i) => (i === index ? value : risk)),
    }));
  };

  const handleRootCauseChange = (riskIndex: number, whyIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      rootCauses: prev.rootCauses.map((rootCause) =>
        rootCause.riskIndex === riskIndex
          ? {
              ...rootCause,
              whys: rootCause.whys.map((why, i) => (i === whyIndex ? value : why)),
            }
          : rootCause
      ),
    }));
  };

  const handlePreventiveActionChange = (id: string, updates: Partial<PreventiveAction>) => {
    setData((prev) => ({
      ...prev,
      preventiveActions: prev.preventiveActions.map((action) =>
        action.id === id
          ? {
              ...action,
              ...updates,
            }
          : action
      ),
    }));
  };

  const addPreventiveAction = () => {
    setData((prev) => ({
      ...prev,
      preventiveActions: [
        ...prev.preventiveActions,
        { id: nanoid(), risk: '', action: '', owner: '', due: '', status: '' },
      ],
    }));
  };

  const removePreventiveAction = (id: string) => {
    setData((prev) => ({
      ...prev,
      preventiveActions: prev.preventiveActions.filter((action) => action.id !== id),
    }));
  };

  const handleCheckpointChange = (index: number, field: 'metric' | 'reporting', value: string) => {
    setData((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((checkpoint, i) =>
        i === index
          ? {
              ...checkpoint,
              [field]: value,
            }
          : checkpoint
      ),
    }));
  };

  const handleCommitmentChange = (field: 'nextReviewDate' | 'trackerLink' | 'facilitatorSignOff', value: string) => {
    setData((prev) => ({
      ...prev,
      commitments: {
        ...prev.commitments,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    save();
  };

  const handleClear = () => {
    if (window.confirm('Clear all worksheet data?')) {
      reset();
    }
  };

  const handleExportPdf = async () => {
    if (!worksheetRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(worksheetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      let heightLeft = imgHeight - pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, heightLeft - imgHeight, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`pre-mortem-workshop-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pre-Mortem Workshop Planner</h1>
            <p className="text-sm text-slate-500">
              Capture your team&apos;s pre-mortem insights and export a workshop-ready worksheet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isExporting ? 'Exporting…' : 'Export to PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div
          ref={worksheetRef}
          id="worksheet"
          className="space-y-8 rounded-2xl bg-white p-8 shadow-lg"
        >
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-600">Project title</label>
              <input
                value={data.header.projectTitle}
                onChange={(event) => handleHeaderChange('projectTitle', event.target.value)}
                placeholder="What initiative are you running?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Workshop date &amp; time</label>
              <input
                value={data.header.dateTime}
                onChange={(event) => handleHeaderChange('dateTime', event.target.value)}
                placeholder="e.g. 12 Aug 2025 · 10:00–12:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Facilitator</label>
              <input
                value={data.header.facilitator}
                onChange={(event) => handleHeaderChange('facilitator', event.target.value)}
                placeholder="Who is leading the session?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Participants</label>
              <textarea
                value={data.header.participants}
                onChange={(event) => handleHeaderChange('participants', event.target.value)}
                placeholder="List participant names"
                rows={2}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 1 · Success Snapshot</h2>
            <p className="text-sm text-slate-500">Describe what success looks like. Capture three vivid headlines.</p>
            <div className="space-y-3">
              {data.successSnapshot.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-2 text-sm font-medium text-indigo-500">{index + 1}.</span>
                  <textarea
                    className="w-full"
                    rows={2}
                    value={item}
                    onChange={(event) => handleSuccessSnapshotChange(index, event.target.value)}
                    placeholder="What would you celebrate at the project launch?"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 2 · Catastrophe Headline</h2>
            <p className="text-sm text-slate-500">If everything went wrong, what would the news headline say?</p>
            <input
              value={data.catastropheHeadline}
              onChange={(event) => handleCatastropheHeadlineChange(event.target.value)}
              placeholder="Project implodes because…"
            />
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Step 3 · Brainstorm Failures</h2>
              <button
                type="button"
                onClick={addFailure}
                className="border border-dashed border-indigo-400 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                + Add item
              </button>
            </div>
            <p className="text-sm text-slate-500">List everything that could cause the catastrophe. Tick items that feel likely.</p>
            <div className="space-y-3">
              {data.brainstormFailures.map((failure) => (
                <div key={failure.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={failure.checked}
                      onChange={(event) => handleFailureChange(failure.id, { checked: event.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Likely
                  </label>
                  <textarea
                    className="min-h-[70px] flex-1"
                    value={failure.text}
                    onChange={(event) => handleFailureChange(failure.id, { text: event.target.value })}
                    placeholder="What could fail?"
                  />
                  <button
                    type="button"
                    onClick={() => removeFailure(failure.id)}
                    className="self-start text-sm text-rose-500 hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 4 · Top 5 Risks</h2>
            <p className="text-sm text-slate-500">
              Prioritise the five scariest risks. These will drive the deeper analysis.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {data.topRisks.map((risk, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-slate-600">Risk #{index + 1}</label>
                  <textarea
                    rows={2}
                    value={risk}
                    onChange={(event) => handleTopRiskChange(index, event.target.value)}
                    placeholder="Summarise the risk"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 5 · Root Causes (5 Whys)</h2>
            <p className="text-sm text-slate-500">
              For the top three risks, ask “Why?” five times to uncover hidden causes.
            </p>
            <div className="space-y-6">
              {data.rootCauses.map((rootCause) => (
                <div key={rootCause.riskIndex} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="text-lg font-semibold text-indigo-600">
                    Risk #{rootCause.riskIndex + 1}: {data.topRisks[rootCause.riskIndex] || 'Describe the risk'}
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {rootCause.whys.map((why, index) => (
                      <div key={index} className="space-y-1">
                        <label className="block text-sm font-medium text-slate-600">Why #{index + 1}?</label>
                        <textarea
                          rows={2}
                          value={why}
                          onChange={(event) => handleRootCauseChange(rootCause.riskIndex, index, event.target.value)}
                          placeholder="Dig deeper into the root cause"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Step 6 · Preventive Actions Register</h2>
              <button
                type="button"
                onClick={addPreventiveAction}
                className="border border-dashed border-emerald-400 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
              >
                + Add action
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 font-medium text-slate-600">Risk</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Preventive action</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Owner</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Due</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Status</th>
                    <th className="px-3 py-2" aria-label="Remove" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.preventiveActions.map((action) => (
                    <tr key={action.id} className="align-top">
                      <td className="px-3 py-2">
                        <textarea
                          rows={2}
                          value={action.risk}
                          onChange={(event) => handlePreventiveActionChange(action.id, { risk: event.target.value })}
                          placeholder="Which risk is addressed?"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <textarea
                          rows={2}
                          value={action.action}
                          onChange={(event) => handlePreventiveActionChange(action.id, { action: event.target.value })}
                          placeholder="What will you do to prevent it?"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={action.owner}
                          onChange={(event) => handlePreventiveActionChange(action.id, { owner: event.target.value })}
                          placeholder="Name"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={action.due}
                          onChange={(event) => handlePreventiveActionChange(action.id, { due: event.target.value })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={action.status}
                          onChange={(event) => handlePreventiveActionChange(action.id, { status: event.target.value })}
                        >
                          <option value="">Select status</option>
                          <option value="Not started">Not started</option>
                          <option value="In progress">In progress</option>
                          <option value="At risk">At risk</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removePreventiveAction(action.id)}
                          className="text-sm text-rose-500 hover:text-rose-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 7 · Checkpoints &amp; Metrics</h2>
            <p className="text-sm text-slate-500">Define how you will keep the project honest and measure progress.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {data.checkpoints.map((checkpoint, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-600">Metric / Source</label>
                    <textarea
                      rows={2}
                      value={checkpoint.metric}
                      onChange={(event) => handleCheckpointChange(index, 'metric', event.target.value)}
                      placeholder="What will you measure?"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-600">When &amp; how reported</label>
                    <textarea
                      rows={2}
                      value={checkpoint.reporting}
                      onChange={(event) => handleCheckpointChange(index, 'reporting', event.target.value)}
                      placeholder="Cadence and channel"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Step 8 · Commitments</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-600">Next review date</label>
                <input
                  type="date"
                  value={data.commitments.nextReviewDate}
                  onChange={(event) => handleCommitmentChange('nextReviewDate', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Tracker link</label>
                <input
                  type="url"
                  value={data.commitments.trackerLink}
                  onChange={(event) => handleCommitmentChange('trackerLink', event.target.value)}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Facilitator sign-off</label>
                <input
                  value={data.commitments.facilitatorSignOff}
                  onChange={(event) => handleCommitmentChange('facilitatorSignOff', event.target.value)}
                  placeholder="Name / signature"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
