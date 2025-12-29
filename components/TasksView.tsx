import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, TeamMember } from '../types';
import { MOCK_TASKS, MOCK_TEAM } from '../services/mockData';
import { Plus, Search, Calendar, User, MoreHorizontal, CheckCircle2, Clock, AlertCircle, ArrowRight, X, ChevronDown } from 'lucide-react';

const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<'ALL' | 'MINE'>('ALL');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('1'); // Default to self

  const getColumns = () => {
    const columns: { id: TaskStatus; label: string; color: string; icon: any }[] = [
      { id: 'TODO', label: 'To Do', color: 'border-slate-200', icon:  AlertCircle },
      { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-200', icon: Clock },
      { id: 'REVIEW', label: 'Review', color: 'border-amber-200', icon: Search },
      { id: 'DONE', label: 'Done', color: 'border-emerald-200', icon: CheckCircle2 },
    ];
    return columns;
  };

  const handleCreateTask = () => {
    const task: Task = {
        id: `t${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDesc,
        dueDate: new Date().toISOString().split('T')[0],
        priority: newTaskPriority,
        status: 'TODO',
        assignedToId: newTaskAssignee,
        tags: []
    };
    setTasks([...tasks, task]);
    setShowNewTaskModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAssignChange = (taskId: string, memberId: string) => {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedToId: memberId } : t));
  };

  const getAssignee = (id: string) => MOCK_TEAM.find(m => m.id === id) || MOCK_TEAM[0];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-safe-top pb-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 z-20 flex flex-col gap-4">
            <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
                <button 
                    onClick={() => setShowNewTaskModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" /> New Task
                </button>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                    All Tasks
                </button>
                <button 
                    onClick={() => setFilter('MINE')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'MINE' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                >
                    My Tasks
                </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 whitespace-nowrap scroll-smooth">
            <div className="inline-flex h-full gap-5">
                {getColumns().map(col => (
                    <div key={col.id} className="w-80 flex flex-col h-full">
                        {/* Column Header */}
                        <div className={`flex items-center justify-between mb-4 px-1 pb-2 border-b-2 ${col.color}`}>
                            <div className="flex items-center gap-2">
                                <col.icon className={`w-4 h-4 ${col.id === 'DONE' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <span className="font-bold text-slate-700">{col.label}</span>
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>
                        </div>

                        {/* Drop Zone / List */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
                            {tasks
                                .filter(t => t.status === col.id && (filter === 'ALL' || t.assignedToId === '1'))
                                .map(task => {
                                    const assignee = getAssignee(task.assignedToId);
                                    return (
                                        <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group whitespace-normal relative">
                                            {/* Priority Badge */}
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                                                    task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 
                                                    task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                <button className="text-slate-300 hover:text-slate-600">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1">{task.title}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{task.description}</p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${assignee.avatar} ring-2 ring-white`}>
                                                        {assignee.name.charAt(0)}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">{new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                                </div>

                                                {/* Move Actions (Simple Implementation) */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {task.status !== 'TODO' && (
                                                        <button onClick={() => handleStatusChange(task.id, 'TODO')} className="p-1 hover:bg-slate-100 rounded" title="Move to Todo"><ArrowRight className="w-3 h-3 rotate-180 text-slate-400" /></button>
                                                    )}
                                                    {task.status !== 'DONE' && (
                                                        <button onClick={() => {
                                                            const next = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'REVIEW' : 'DONE';
                                                            handleStatusChange(task.id, next);
                                                        }} className="p-1 hover:bg-slate-100 rounded" title="Advance"><ArrowRight className="w-3 h-3 text-slate-400" /></button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {/* Empty State */}
                            {tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="h-32 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* New Task Modal */}
        {showNewTaskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Create Task</h2>
                        <button onClick={() => setShowNewTaskModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Task Title</label>
                            <input 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500" 
                                placeholder="E.g., Review Q3 Budget"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea 
                                value={newTaskDesc}
                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24" 
                                placeholder="Details..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
                                <select 
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                                    className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Assign To</label>
                                <select 
                                    value={newTaskAssignee}
                                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                                    className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-none outline-none"
                                >
                                    {MOCK_TEAM.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleCreateTask}
                            disabled={!newTaskTitle}
                            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default TasksView;