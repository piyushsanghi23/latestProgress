function feedback_smiley_click(id)
{
    str1 = id.replace ( /[^\d]/g, '' );
    alert(str1);
}
function submitFeedback()
{
    var text=document.getElementById('textArea').value;
    alert(text);
}