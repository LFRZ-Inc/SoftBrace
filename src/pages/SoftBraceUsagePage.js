import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function SoftBraceUsagePage() {
  const currentUrl = window.location.origin + '/softbrace-usage';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to SoftBrace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The modern way to protect your gums & braces.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCodeSVG 
              value={currentUrl}
              size={150}
              level="M"
              includeMargin={true}
            />
            <p className="text-center text-sm text-gray-600 mt-2">
              Scan for quick access to usage instructions
            </p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Before First Use Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Before First Use:
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              🧼 Rinse strips under warm water with mild soap. Pat dry.
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              Always wash hands before handling strips.
            </p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* How to Use Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            How to Use:
          </h2>
          
          {/* Usage Example Image */}
          <div className="mb-6 text-center">
            <img 
              src="/images/softbrace-usage-example.jpg" 
              alt="Example of SoftBrace strips properly applied on upper braces"
              className="mx-auto rounded-lg shadow-md max-w-md w-full"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              Example: SoftBrace strips properly applied on upper braces. The same technique applies to bottom braces.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <p className="text-gray-700 dark:text-gray-200">
                SoftBrace is designed to rest on your gum and brace brackets, not directly on the wire. 
                As shown in the image above, the blue strips cover the brackets while protecting your gums.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <p className="text-gray-700 dark:text-gray-200">
                Apply strip gently over brackets, resting against the gum for comfort and protection.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <p className="text-gray-700 dark:text-gray-200">
                Do not press strip tightly onto the wire.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>For bottom braces:</strong> Use the exact same technique as shown for the upper braces.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Usage Guidelines Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Usage Guidelines:
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">•</span>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Single-use only:</strong> One strip per day; discard at the end of day.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">•</span>
              <p className="text-gray-700 dark:text-gray-200">
                Remove before eating to avoid accidental ingestion, or at user discretion.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">•</span>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Never sleep with SoftBrace in place</strong> — remove before going to bed.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">•</span>
              <p className="text-gray-700 dark:text-gray-200">
                If washed during the day, strip may be reapplied once, but should be discarded by the end of the day.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Why SoftBrace Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Why SoftBrace:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              <p className="text-gray-700 dark:text-gray-200">More comfortable than wax</p>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              <p className="text-gray-700 dark:text-gray-200">Stays flexible, non-sticky</p>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              <p className="text-gray-700 dark:text-gray-200">No clumping or residue</p>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              <p className="text-gray-700 dark:text-gray-200">Easy to shape & apply</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 my-8" />

        {/* Legal and Safety Information */}
        <div className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              <strong>SoftBrace is made with FDA-compliant silicone.</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              Always monitor for signs of irritation.
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              <strong>Not for use by children under 10 years old.</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              <em>Not a medical device. Use only as directed.</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-lg font-medium text-primary mb-2">
            Thank you for choosing SoftBrace.
          </p>
          <p className="text-xl text-blue-500">
            Smile comfortably. 💙
          </p>
        </div>

        {/* Back to Shop Button */}
        <div className="text-center mt-8">
          <a 
            href="/shop"
            className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            ← Back to Shop
          </a>
        </div>
      </div>
    </div>
  );
}

export default SoftBraceUsagePage; 