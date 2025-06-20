import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function SoftBraceUsagePage() {
  const currentUrl = window.location.origin + '/softbrace-usage';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to SoftBrace
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
            The modern way to protect your gums & braces.
          </p>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Before First Use Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Before First Use:
          </h2>
          <div className="bg-blue-100 dark:bg-blue-800 border border-blue-300 dark:border-blue-600 p-6 rounded-lg shadow-sm">
            <p className="text-gray-900 dark:text-white mb-3 font-medium text-lg">
              🧼 Rinse strips under warm water with mild soap. Pat dry.
            </p>
            <p className="text-gray-900 dark:text-white font-medium text-lg">
              Always wash hands before handling strips.
            </p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* How to Use Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How to Use:
          </h2>
          
          {/* Usage Example Image */}
          <div className="mb-6 text-center">
            <img 
              src="/images/softbrace-usage-example.png" 
              alt="Example of SoftBrace strips properly applied on upper braces"
              className="mx-auto rounded-lg shadow-md max-w-md w-full"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 italic font-medium">
              Example: SoftBrace strips properly applied on upper braces. The same technique applies to bottom braces.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-green-600 mr-3 mt-1 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">
                SoftBrace is designed to rest on your gum and brace brackets, not directly on the wire. 
                As shown in the image above, the blue strips cover the brackets while protecting your gums.
              </p>
            </div>
            <div className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-green-600 mr-3 mt-1 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">
                Apply strip gently over brackets, resting against the gum for comfort and protection.
              </p>
            </div>
            <div className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-green-600 mr-3 mt-1 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">
                Do not press strip tightly onto the wire.
              </p>
            </div>
            <div className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-green-600 mr-3 mt-1 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">
                <strong>For bottom braces:</strong> Use the exact same technique as shown for the upper braces.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Usage Guidelines Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Usage Guidelines:
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-orange-50 dark:bg-orange-900 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <span className="text-orange-600 dark:text-orange-400 mr-3 mt-1 text-xl">•</span>
              <p className="text-gray-900 dark:text-white font-medium">
                <strong>Single-use only:</strong> One strip per day; discard at the end of day.
              </p>
            </div>
            <div className="flex items-start bg-orange-50 dark:bg-orange-900 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <span className="text-orange-600 dark:text-orange-400 mr-3 mt-1 text-xl">•</span>
              <p className="text-gray-900 dark:text-white font-medium">
                Remove before eating to avoid accidental ingestion, or at user discretion.
              </p>
            </div>
            <div className="flex items-start bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <span className="text-red-600 dark:text-red-400 mr-3 mt-1 text-xl">•</span>
              <p className="text-gray-900 dark:text-white font-medium">
                <strong>Never sleep with SoftBrace in place</strong> — remove before going to bed.
              </p>
            </div>
            <div className="flex items-start bg-orange-50 dark:bg-orange-900 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <span className="text-orange-600 dark:text-orange-400 mr-3 mt-1 text-xl">•</span>
              <p className="text-gray-900 dark:text-white font-medium">
                If washed during the day, strip may be reapplied once, but should be discarded by the end of the day.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Why SoftBrace Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why SoftBrace:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">More comfortable than wax</p>
            </div>
            <div className="flex items-center bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">Stays flexible, non-sticky</p>
            </div>
            <div className="flex items-center bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">No clumping or residue</p>
            </div>
            <div className="flex items-center bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✅</span>
              <p className="text-gray-900 dark:text-white font-medium">Easy to shape & apply</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Legal and Safety Information */}
        <div className="mb-8">
          <div className="bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 p-6 rounded-lg shadow-sm">
            <p className="text-gray-900 dark:text-white mb-3 font-bold text-lg">
              SoftBrace is made with FDA-compliant silicone.
            </p>
            <p className="text-gray-900 dark:text-white mb-3 font-medium">
              Always monitor for signs of irritation.
            </p>
            <p className="text-gray-900 dark:text-white mb-3 font-bold">
              Not for use by children under 10 years old.
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
              <em>Not a medical device. Use only as directed.</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Thank you for choosing SoftBrace.
          </p>
          <p className="text-2xl text-blue-600 dark:text-blue-400 font-bold">
            Smile comfortably. 💙
          </p>
        </div>

        {/* Back to Shop Button */}
        <div className="text-center mb-8">
          <a 
            href="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg inline-block transition-colors font-bold text-lg shadow-lg"
          >
            ← Back to Shop
          </a>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* QR Code Section - Moved to Bottom */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Access
          </h3>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
              <QRCodeSVG 
                value={currentUrl}
                size={150}
                level="M"
                includeMargin={true}
              />
              <p className="text-center text-sm text-gray-700 mt-3 font-medium">
                Scan for quick access to these usage instructions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoftBraceUsagePage; 