import React, { useState, useRef } from 'react';
import { TemplateSelector } from "@/components/TemplateSelector";
import { fetchTemplateHTML, updateTemplateHTML, testTemplate, uploadTemplate } from "@/scripts/template-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Save, Upload, FileCode, FlaskConical } from "lucide-react";

export default function TemplateGallery() {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // New template form
  const [newTemplateId, setNewTemplateId] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplateHtml, setNewTemplateHtml] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplateHtml(null);
    setIsEditing(false);
    setEditedHtml("");
  };

  const handleViewTemplate = async () => {
    if (!selectedTemplateId) return;
    
    setLoading(true);
    try {
      const html = await fetchTemplateHTML(selectedTemplateId);
      setTemplateHtml(html);
      setEditedHtml(html); // Initialize editor with the current HTML
    } catch (error) {
      console.error("Error fetching template HTML:", error);
      toast({
        title: "Error",
        description: "Failed to fetch template HTML",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestTemplate = async () => {
    if (!selectedTemplateId) return;
    
    setTestLoading(true);
    try {
      const pdfBlob = await testTemplate(selectedTemplateId);
      if (pdfBlob) {
        // Create a download link for the PDF
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTemplateId}-test.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Test Successful",
          description: "Test PDF has been downloaded.",
          variant: "default"
        });
      } else {
        throw new Error("Failed to generate test PDF");
      }
    } catch (error) {
      console.error("Error testing template:", error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to test template",
        variant: "destructive"
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplateId || !editedHtml) return;
    
    setSaveLoading(true);
    try {
      const success = await updateTemplateHTML(selectedTemplateId, editedHtml);
      if (success) {
        setTemplateHtml(editedHtml);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Template updated successfully",
          variant: "default"
        });
      } else {
        throw new Error("Failed to update template");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update template",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateId || !newTemplateName || !newTemplateHtml) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setUploadLoading(true);
    try {
      const result = await uploadTemplate(
        newTemplateId,
        newTemplateName,
        newTemplateHtml,
        newTemplateDescription
      );
      
      if (result) {
        toast({
          title: "Success",
          description: `Template "${newTemplateName}" created successfully`,
          variant: "default"
        });
        
        // Reset form
        setNewTemplateId("");
        setNewTemplateName("");
        setNewTemplateDescription("");
        setNewTemplateHtml("");
        
        // Select the new template
        setSelectedTemplateId(newTemplateId);
        setTemplateHtml(null);
      } else {
        throw new Error("Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create template",
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CV Template Management</h1>
        <p className="text-gray-600">View, test, edit, and create CV templates</p>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="mb-8">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="create">Create New Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <div className="mb-8">
            <TemplateSelector 
              onSelect={handleTemplateSelect} 
              selectedTemplateId={selectedTemplateId} 
            />
          </div>

          {selectedTemplateId && (
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={handleViewTemplate} 
                disabled={loading}
                size="lg"
                variant="default"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FileCode className="mr-2 h-4 w-4" />
                    View Template
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleTestTemplate}
                disabled={testLoading || !templateHtml}
                size="lg"
                variant="outline"
              >
                {testLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Test Template
                  </>
                )}
              </Button>
            </div>
          )}

          {templateHtml && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Template Preview</span>
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      Edit Template
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Edit the HTML template below" : "HTML source code"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <div className="flex flex-col space-y-4">
                    <Textarea
                      value={editedHtml}
                      onChange={(e) => setEditedHtml(e.target.value)}
                      className="font-mono text-sm min-h-[400px]" 
                    />
                    <Button 
                      onClick={handleSaveTemplate}
                      disabled={saveLoading}
                      className="self-end"
                    >
                      {saveLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                    <pre className="text-sm">{templateHtml}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Fill in the details below to create a new CV template
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="template-id">Template ID *</Label>
                    <Input
                      id="template-id"
                      placeholder="e.g. modern-blue"
                      value={newTemplateId}
                      onChange={(e) => setNewTemplateId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Unique identifier (no spaces, use hyphens)</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="template-name">Template Name *</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g. Modern Blue Template"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Display name for the template</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Describe your template..."
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">A brief description of the template style</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="template-html">HTML Content *</Label>
                  <Textarea
                    id="template-html"
                    placeholder="Paste your template HTML here..."
                    className="font-mono min-h-[300px]"
                    value={newTemplateHtml}
                    onChange={(e) => setNewTemplateHtml(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    HTML with CSS styles included in the &lt;style&gt; section
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCreateTemplate}
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Template...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Template
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
