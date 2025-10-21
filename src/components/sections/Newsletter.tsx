import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Bell, Shield, Sparkles } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200/30 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg shadow-blue-500/5 overflow-hidden">
              {/* Decorative Top Border */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  {/* Content Section */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Bell className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          Weekly Updates
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Never Miss a{" "}
                      <span className="relative inline-block">
                        <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Perfect Property
                        </span>
                        <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-yellow-500" />
                      </span>
                    </h3>

                    <p className="text-lg text-gray-600 mb-6 max-w-lg">
                      Get curated listings, price drops, and exclusive properties delivered weekly.
                      Be the first to know about new opportunities.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>No spam, ever</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Unsubscribe anytime</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="flex-1 w-full max-w-md">
                    <form
                      action="/api/newsletter/subscribe"
                      method="POST"
                      className="space-y-4"
                    >
                      <div className="relative">
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          required
                          className="h-12 px-4 pr-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✉</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
                      >
                        <span>Get Early Access</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </form>

                    {/* Social Proof */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        Join <span className="font-semibold text-gray-700">5,000+</span> students and landlords already using Home Connect
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
}