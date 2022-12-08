# This program assumes that the target html file was
# downloaded from Google Docs !!!

from bs4 import BeautifulSoup as BS
import datetime
import sys

def main():
    if not len(sys.argv) == 4:
        print("Usage: python process.py <source name> <template name> <target name>.")
    else:
        try:
            source = sys.argv[1]
            template = sys.argv[2]
            target = sys.argv[3]
            add_to_template(source, template, target)
        except OSError as err:
            print("OS error: {0}".format(err))
    
def add_to_template(source, template, target):
    """Adds the content of the source file into the template file,
    which is assumed to contain a div with id "article-container.
    The output is saved in the target file."

    Args:
        source (String): name of the source html file
        template (String): name of the template file
        target (String): name of the target html file
    """
    # Constants
    TITLE_STYLE_TEXT = "transition:0.2s"
    TITLE_ID = "article-title"
    BODY_PARAGRAPH_CLASS = ""

    # Open our downloaded essay (as an html)
    with open(source) as obj:
        my_doc = BS(obj, "html.parser")
        
        
        # clear all styling from Google
        head = my_doc.find("head")
        head.string = ""

        
        # change the title to h1, change its class and id
        title = my_doc.find("p", class_="title")
        title_text = title.span.text
        title.string = title_text
        title['class'] = ""
        title['id'] = TITLE_ID
        title['style'] = TITLE_STYLE_TEXT
        title.name= 'h1'
        
        # change the classes of all the body paragraphs
        for paragraph in my_doc.find_all("p", class_="c3"):
            paragraph['class'] = BODY_PARAGRAPH_CLASS
            if paragraph.span.string:
                paragraph.string = paragraph.span.string
                
        for paragraph in my_doc.find_all("p", class_="c4"):
            paragraph['class'] = BODY_PARAGRAPH_CLASS
            if paragraph.span.string:
                paragraph.string = paragraph.span.string
        
    
        article_tag = my_doc.new_tag("article")
        # Insert a date tag with this format <h6 id="date">September 3, 2020</h6>
        # into article_tag
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        current_time = datetime.datetime.now()
        date_string = months[current_time.month - 1] + " " + str(current_time.year)
        date_tag = my_doc.new_tag("h6", id="date")
        date_tag.string = date_string
        article_tag.append(date_tag)
        
        # add everything in body to the article_container div tag
        for child in my_doc.body.findChildren():
            article_tag.append(child)
        
        # open template
        with open(template) as template:
            template = BS(template, "html.parser")
            # TODO: Change the title in the head tag

            
            # write the entire article tag into the container
            article_container = template.find("div", id="article-container")
            article_container.append(article_tag)
            with open(target, "w", encoding="utf-8") as processed_file:
                processed_file.write(template.prettify())
                
    
main()