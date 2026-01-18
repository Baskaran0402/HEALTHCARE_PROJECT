from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from io import BytesIO
import datetime

class PDFReportGenerator:
    @staticmethod
    def generate_report(data: dict) -> BytesIO:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Title
        story.append(Paragraph("AI Doctor Assistant - Clinical Report", styles['Title']))
        story.append(Spacer(1, 12))

        # Date
        date_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        story.append(Paragraph(f"Generated on: {date_str}", styles['Normal']))
        story.append(Spacer(1, 12))

        # Patient Info
        patient = data.get('patient', {})
        p_info = [
            ["Patient Name:", patient.get('name', 'N/A')],
            ["Age:", str(patient.get('age', 'N/A'))],
            ["Gender:", patient.get('gender', 'N/A')],
            ["MRN:", patient.get('medical_record_number', 'N/A')],
        ]
        t = Table(p_info, colWidths=[100, 300])
        t.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        story.append(t)
        story.append(Spacer(1, 20))

        # Risk Assessment
        assessment = data.get('assessment', {})
        story.append(Paragraph("Risk Assessment", styles['Heading2']))
        
        risk_data = [
            ["Overall Risk Score:", f"{assessment.get('overall_risk_score', 0)}%"],
            ["Risk Level:", assessment.get('overall_risk_level', 'Unknown')],
        ]
        
        # Color code risk
        risk_color = colors.green
        if assessment.get('overall_risk_level') == 'Critical': risk_color = colors.red
        elif assessment.get('overall_risk_level') == 'High': risk_color = colors.orange
        elif assessment.get('overall_risk_level') == 'Moderate': risk_color = colors.yellow

        t_risk = Table(risk_data, colWidths=[150, 250])
        t_risk.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (1, 1), (1, 1), risk_color),
        ]))
        story.append(t_risk)
        story.append(Spacer(1, 12))

        # Clinical Analysis
        story.append(Paragraph("Clinical Analysis", styles['Heading2']))
        report_text = assessment.get('doctor_report', 'No report available.')
        
        # Markdown Parsing Logic
        # We process line by line to detect Headers, Bullets, and formatting
        # ReportLab Paragraph supports simple XML tags: <b>, <i>
        
        lines = report_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Headers
            if line.startswith('# '):
                # H1
                content = line[2:].strip()
                story.append(Paragraph(content, styles['Heading1']))
                story.append(Spacer(1, 6))
            elif line.startswith('## '):
                # H2
                content = line[3:].strip()
                story.append(Paragraph(content, styles['Heading2']))
                story.append(Spacer(1, 6))
            elif line.startswith('### '):
                # H3 - Map to Heading3 or Bold Body text
                content = line[4:].strip()
                try:
                    s = styles['Heading3']
                except KeyError:
                    s = styles['Heading2'] # Fallback
                story.append(Paragraph(content, s))
                story.append(Spacer(1, 4))
                
            # Bullet Points
            elif line.startswith('- ') or line.startswith('* '):
                content = line[2:].strip()
                # Apply inline formatting (bold/italic)
                content = PDFReportGenerator._format_inline_markdown(content)
                # Use Bullet style
                try:
                    style = styles['Bullet']
                except KeyError:
                    # Create bullet style if missing
                    style = ParagraphStyle('Bullet', parent=styles['Normal'], bulletIndent=10, leftIndent=20)
                
                story.append(Paragraph(f"• {content}", style))
                story.append(Spacer(1, 2))
                
            # Normal Text
            else:
                # Apply inline formatting
                content = PDFReportGenerator._format_inline_markdown(line)
                story.append(Paragraph(content, styles['Normal']))
                story.append(Spacer(1, 6))

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

    @staticmethod
    def _format_inline_markdown(text: str) -> str:
        """
        Convert **text** to <b>text</b> and *text* to <i>text</i> for ReportLab.
        """
        # Bold: **text**
        # We need to be careful not to replace mismatched tags, but simple replace usually works for well-formed MD
        # Using a simple state machine or regex is safer, but split logic works for simple cases.
        # Let's use simple logic: recursive replacement of pairs.
        
        # Bold
        while "**" in text:
            # Find first **
            first = text.find("**")
            # Find second ** after first
            second = text.find("**", first + 2)
            if second != -1:
                # Replace with <b>...</b>
                text = text[:first] + "<b>" + text[first+2:second] + "</b>" + text[second+2:]
            else:
                break
                
        # Italic (single *) - tricky because * is also bullet. But we stripped bullets already.
        # Basic implementation for now.
        
        return text
