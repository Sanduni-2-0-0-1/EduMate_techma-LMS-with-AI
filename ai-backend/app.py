from transformers import T5ForConditionalGeneration, T5Tokenizer, AutoModelForCausalLM, AutoTokenizer
import gradio as gr
import PyPDF2

# --- Load models ---
summ_model = T5ForConditionalGeneration.from_pretrained("t5-small")
summ_tokenizer = T5Tokenizer.from_pretrained("t5-small")

chat_model = AutoModelForCausalLM.from_pretrained("distilgpt2")
chat_tokenizer = AutoTokenizer.from_pretrained("distilgpt2")

# --- Helper functions ---
def summarize_text(text):
    input_ids = summ_tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=512, truncation=True)
    output_ids = summ_model.generate(input_ids, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = summ_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return summary

def generate_questions(text):
    sentences = text.split(". ")
    questions = [f"What is meant by: '{s}'?" for s in sentences if len(s) > 10]
    return "\n".join(questions)

def greet_or_chat(message):
    message = message.lower()
    greetings = ["hi", "hello", "hey"]
    lms_keywords = ["lms", "courses", "lessons", "website"]

    if any(g in message for g in greetings):
        return "Hello! I'm your AI Learning Assistant 😊"
    elif any(k in message for k in lms_keywords):
        return "This LMS allows you to learn Web Design, Digital Marketing, and Programming. You can summarize lessons, generate questions, or ask IT queries."
    else:
        input_ids = chat_tokenizer.encode(message + chat_tokenizer.eos_token, return_tensors="pt")
        output_ids = chat_model.generate(input_ids, max_length=100, pad_token_id=chat_tokenizer.eos_token_id)
        response = chat_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return response

def pdf_to_text(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + " "
    return text

def youtube_text(video_transcript):
    # video_transcript should be plain text
    if not video_transcript:
        return ""
    summary = summarize_text(video_transcript)
    questions = generate_questions(video_transcript)
    return f"Summary:\n{summary}\n\nQuestions:\n{questions}"


# --- Gradio UI ---
with gr.Blocks() as demo: 
    gr.Markdown("## AI Learning Assistant")
    with gr.Row():
        with gr.Column():
            user_input = gr.Textbox(label="Ask me something...", placeholder="Type your question here...")
            pdf_input = gr.File(label="Upload PDF (optional)")
            video_input = gr.Textbox(label="Paste YouTube transcript (optional)", placeholder="Paste transcript here")
            chat_btn = gr.Button("Send")
        with gr.Column():
            output_box = gr.Textbox(label="AI Response", interactive=False, lines=15)

    def respond(user_input, pdf_file=None, video_transcript=None):
        if pdf_file:
            text = pdf_to_text(pdf_file.name)
            summary = summarize_text(text)
            questions = generate_questions(text)
            return f"Summary:\n{summary}\n\nQuestions:\n{questions}"
        elif video_transcript:
            return youtube_text(video_transcript)
        else:
            return greet_or_chat(user_input)

    chat_btn.click(respond, inputs=[user_input, pdf_input, video_input], outputs=output_box)

demo.launch(share=True)