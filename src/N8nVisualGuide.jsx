import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Settings, Link2, Mail, MessageSquare, Database, Zap } from 'lucide-react';

const N8nVisualGuide = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const workflowSteps = [
    {
      step: "1",
      title: "Webhook Setup (Lead Entry Point)",
      icon: "🔗",
      color: "from-blue-500 to-cyan-500",
      instructions: [
        "n8n workflow mein jaayein",
        "'+' button click karein",
        "'On app event' ya 'Webhook' search karein",
        "'Webhook' node select karein",
        "HTTP Method: POST select karein",
        "Path: 'lead-entry' type karein",
        "'Listen for Test Event' click karein",
        "Webhook URL copy karein (yeh URL apne lead sources mein use karenge)",
        "Test ke liye Postman ya curl se test data bhejein"
      ],
      testData: {
        name: "Test Lead",
        email: "test@example.com",
        phone: "1234567890",
        source: "Facebook Ads",
        message: "I'm interested in your service"
      }
    },
    {
      step: "2",
      title: "AI Qualification Node",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
      instructions: [
        "'+' button click karein Webhook node ke baad",
        "'OpenAI' search karein aur select karein",
        "Credential add karein (OpenAI API key)",
        "Resource: 'Text' select karein",
        "Operation: 'Message a Model' select karein",
        "Model: 'gpt-4' ya 'gpt-3.5-turbo' select karein",
        "Prompt mein yeh text daalein:"
      ],
      prompt: `You are a lead qualification assistant. Analyze this lead and provide:
1. Quality Score (1-10)
2. Temperature (hot/warm/cold)
3. Is it junk? (yes/no)
4. Intent/Interest category

Lead Details:
Name: {{$json.name}}
Email: {{$json.email}}
Phone: {{$json.phone}}
Message: {{$json.message}}
Source: {{$json.source}}

Respond ONLY in this JSON format:
{
  "score": 8,
  "temperature": "hot",
  "is_junk": "no",
  "intent": "product_purchase"
}`,
      nextStep: "Output parsing ke liye 'JSON Parse' karein"
    },
    {
      step: "3",
      title: "Filter Junk Leads",
      icon: "🗑️",
      color: "from-red-500 to-orange-500",
      instructions: [
        "'+' button click karein AI node ke baad",
        "'IF' node search karein aur select karein",
        "Condition add karein:",
        "Field: {{$json.is_junk}}",
        "Operation: 'Not Equal'",
        "Value: 'yes'",
        "Yeh junk leads ko filter kar dega"
      ]
    },
    {
      step: "4",
      title: "Switch Node - Temperature Based Routing",
      icon: "🔀",
      color: "from-green-500 to-teal-500",
      instructions: [
        "IF node ke 'true' output se '+' click karein",
        "'Switch' node search karein",
        "Mode: 'Rules Based' select karein",
        "Rule 1 add karein:",
        "  - Condition: {{$json.temperature}} = 'hot'",
        "  - Output: 0",
        "Rule 2 add karein:",
        "  - Condition: {{$json.temperature}} = 'warm'",
        "  - Output: 1",
        "Rule 3 add karein:",
        "  - Condition: {{$json.temperature}} = 'cold'",
        "  - Output: 2",
        "Ab 3 outputs ready hain (Hot, Warm, Cold)"
      ]
    },
    {
      step: "5a",
      title: "HOT LEADS - Slack/Email Notification",
      icon: "🔥",
      color: "from-yellow-500 to-red-500",
      instructions: [
        "Switch node ke Output 0 (Hot) se '+' click karein",
        "'Slack' search karein aur select karein",
        "Credential add karein (Slack workspace connect)",
        "Resource: 'Message' select karein",
        "Operation: 'Post' select karein",
        "Channel: '#sales' select karein",
        "Message Text mein:"
      ],
      message: `🔥 HOT LEAD ALERT! 🔥

Name: {{$json.name}}
Email: {{$json.email}}
Phone: {{$json.phone}}
Score: {{$json.score}}/10
Source: {{$json.source}}
Intent: {{$json.intent}}

Message: {{$json.message}}

⚡ Contact immediately!`,
      additionalNodes: [
        "Slack ke baad '+' click karke 'Gmail' node add karein",
        "Sales team ko email bhi bhej sakte hain",
        "Parallel mein 'Google Sheets' node add karke tracking kar sakte hain"
      ]
    },
    {
      step: "5b",
      title: "WARM LEADS - Email Nurturing Sequence",
      icon: "🌡️",
      color: "from-orange-500 to-yellow-500",
      instructions: [
        "Switch node ke Output 1 (Warm) se '+' click karein",
        "**Day 1 - Welcome Email:**",
        "'Gmail' node add karein (ya SendGrid/Mailgun)",
        "To: {{$json.email}}",
        "Subject: 'Welcome! Let's get started'",
        "Body mein welcome message likhen",
        "",
        "**Wait 2 Days:**",
        "Gmail node ke baad '+' click karein",
        "'Wait' node search karein",
        "Amount: 2, Unit: Days",
        "",
        "**Day 3 - Testimonials:**",
        "Wait node ke baad '+' click karein",
        "'Gmail' node phir add karein",
        "Subject: 'See what our customers say'",
        "Body mein testimonials add karein",
        "",
        "**Wait 2 Days Again:**",
        "'Wait' node: 2 days",
        "",
        "**Day 5 - Offer + CTA:**",
        "'Gmail' node",
        "Subject: 'Special offer just for you'",
        "Body mein offer aur strong CTA"
      ]
    },
    {
      step: "5c",
      title: "COLD LEADS - Recovery Flow",
      icon: "❄️",
      color: "from-cyan-500 to-blue-500",
      instructions: [
        "Switch node ke Output 2 (Cold) se '+' click karein",
        "**Day 1 - Reminder:**",
        "'Gmail' node add karein",
        "Subject: 'Did you forget something?'",
        "",
        "**Wait 2 Days**",
        "",
        "**Day 3 - Case Study:**",
        "'Gmail' node",
        "Subject: 'How we helped [similar company]'",
        "",
        "**Wait 2 Days**",
        "",
        "**Day 5 - Urgent Offer:**",
        "'Gmail' node",
        "Subject: '⏰ Last chance - Limited time offer'",
        "Is email mein urgency create karein"
      ]
    },
    {
      step: "6",
      title: "Check Replies (After Nurturing)",
      icon: "📧",
      color: "from-indigo-500 to-purple-500",
      instructions: [
        "Sabhi email sequences ke baad 'Merge' node add karein",
        "Teeno flows (Hot/Warm/Cold) ko merge karein",
        "Merge ke baad '+' click karein",
        "'Gmail' node add karein",
        "Operation: 'Search' select karein",
        "Query: 'from:{{$json.email}}'",
        "",
        "Phir 'IF' node add karein:",
        "Condition: {{$json.length}} > 0",
        "(Agar reply aaya hai to length > 0 hoga)"
      ]
    },
    {
      step: "7a",
      title: "Reply AAYA - CRM mein add karein",
      icon: "✅",
      color: "from-green-500 to-emerald-500",
      instructions: [
        "IF node ke 'true' output se '+' click karein",
        "'HubSpot' ya 'Pipedrive' search karein",
        "Operation: 'Create Deal' select karein",
        "Deal Name: {{$json.name}}",
        "Amount: {{$json.deal_value}}",
        "Stage: 'Qualified Lead'",
        "",
        "Parallel mein Slack notification bhi bhej sakte hain:",
        "Channel: '#sales-wins'",
        "Message: '🎉 Lead Converted! {{$json.name}}'"
      ]
    },
    {
      step: "7b",
      title: "Reply NAHI AAYA - Long-term Nurturing",
      icon: "🔄",
      color: "from-gray-500 to-slate-500",
      instructions: [
        "IF node ke 'false' output se '+' click karein",
        "'Loop' structure banayein:",
        "",
        "1. 'Wait' node: 15 days",
        "2. 'Gmail' node: Value content (tips, offers)",
        "3. 'Loop Item' node se wapas connect karein",
        "",
        "Ya simply:",
        "'Google Sheets' mein add karein 'Long-term list'",
        "Har 15 din baad manually ya automation se email bhejein"
      ]
    }
  ];

  const quickTips = [
    {
      title: "Gmail Setup",
      icon: <Mail className="w-5 h-5" />,
      tips: [
        "n8n mein Gmail credentials add karne ke liye OAuth2 use karein",
        "Google Cloud Console mein project banayein",
        "Gmail API enable karein",
        "Credentials create karein aur n8n mein add karein"
      ]
    },
    {
      title: "Testing",
      icon: <Zap className="w-5 h-5" />,
      tips: [
        "Har node ke baad 'Execute Node' click karke test karein",
        "Sample data use karein testing ke liye",
        "Pehle inactive mode mein test karein (emails actual mein na jaayein)",
        "Sab kuch working hai tab live karein"
      ]
    },
    {
      title: "Best Practices",
      icon: <Settings className="w-5 h-5" />,
      tips: [
        "Error handling ke liye 'Error Trigger' node use karein",
        "Har critical step pe 'Set' node se data store karein",
        "Logs check karne ke liye executions tab dekhein",
        "Workflow ko active/inactive easily switch kar sakte hain"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-6 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
              🎯
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                n8n Visual Workflow Guide
              </h1>
              <p className="text-purple-200">Step-by-step node setup - Copy paste nahi, click karke banayein!</p>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <p className="text-yellow-200 text-sm md:text-base">
              💡 <strong>Important:</strong> n8n mein code paste nahi hota! Aapko visual nodes drag-drop karke connect karna hai. Yeh guide exactly batayega ki kaunsa node kaise setup karein.
            </p>
          </div>
        </div>

        {/* Main Workflow Steps */}
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
              <button
                onClick={() => toggleSection(index)}
                className={`w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center justify-between bg-gradient-to-r ${step.color} bg-opacity-10`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl backdrop-blur-sm">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 font-semibold">STEP {step.step}</div>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                </div>
                {expandedSections[index] ? (
                  <ChevronDown className="w-6 h-6 text-purple-400" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-purple-400" />
                )}
              </button>

              {expandedSections[index] && (
                <div className="p-6 space-y-4 bg-slate-900/50">
                  {/* Instructions */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Kaise Setup Karein:
                    </h4>
                    <ol className="space-y-2 text-gray-300">
                      {step.instructions.map((instruction, i) => (
                        <li key={i} className="flex gap-3">
                          {instruction ? (
                            <>
                              <span className="text-purple-400 font-mono text-sm mt-0.5">•</span>
                              <span className="text-sm leading-relaxed">{instruction}</span>
                            </>
                          ) : (
                            <div className="h-2"></div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Prompt/Message */}
                  {step.prompt && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="text-purple-300 font-semibold mb-2">📝 Prompt Text:</h4>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-slate-900/50 p-3 rounded overflow-x-auto">
                        {step.prompt}
                      </pre>
                    </div>
                  )}

                  {step.message && (
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                      <h4 className="text-blue-300 font-semibold mb-2">💬 Message Template:</h4>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-slate-900/50 p-3 rounded">
                        {step.message}
                      </pre>
                    </div>
                  )}

                  {/* Test Data */}
                  {step.testData && (
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                      <h4 className="text-green-300 font-semibold mb-2">🧪 Test Data (Webhook test ke liye):</h4>
                      <pre className="text-sm text-gray-300 bg-slate-900/50 p-3 rounded overflow-x-auto">
                        {JSON.stringify(step.testData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Additional Nodes */}
                  {step.additionalNodes && (
                    <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                      <h4 className="text-orange-300 font-semibold mb-2">➕ Additional Options:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        {step.additionalNodes.map((node, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-orange-400">→</span>
                            {node}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {quickTips.map((tip, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-purple-400">{tip.icon}</div>
                <h3 className="text-white font-bold">{tip.title}</h3>
              </div>
              <ul className="space-y-2">
                {tip.tips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-purple-400">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready to Build?</h3>
          <p className="text-purple-100 mb-6">
            Har step ko follow karein, nodes add karein, aur apna pehla automated lead conversion workflow banayein!
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-purple-100">
            <span>✓ No coding required</span>
            <span>✓ Visual interface</span>
            <span>✓ Easy to test</span>
            <span>✓ Powerful automation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nVisualGuide;