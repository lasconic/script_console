//=============================================================================
//  MuseScore
//  Linux Music Score Editor
//  $Id:$
//
//  MuseScore Plugin console based on Amarok Script Console
//
//  Copyright (C)2010
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

//
//    This is ECMAScript code (ECMA-262 aka "Java Script")
//

function globalScopeEval( inputCode )
{
  try
  {
      result = eval( inputCode ) + " ";
  }
  catch( error )
  {
      result = error + " ";
  }
  return result;
}

function ScriptConsoleMainWindow()
{
  QMainWindow.call( this, null );

  var mainWidget = new QWidget( this );
  this.historyList = new QListWidget( mainWidget );
  this.historyList.sizeHint = new QSize(900, 600);
  this.historyList.size = new QSize(900, 600);
  this.historyList.verticalScrollMode = QAbstractItemView.ScrollPerPixel;
  this.inputLine = new QTextEdit( mainWidget );
  this.executeButton = new QPushButton( mainWidget );
  this.commandArray = [];
  this.commandPos = -1;
  this.executeButton.clicked.connect( this, this.executeLine );
  this.executeButton.text = "Execute Code";
  this.windowTitle = "MuseScore Plugin Console";
  //the following line doesn't work for some reason:
  //executeButton.shortcut = new QKeySequence( "CTRL+Return" );

  var executeShortcut = new QShortcut( this );
  executeShortcut.key =  new QKeySequence( "CTRL+Return" );
  executeShortcut.activated.connect( this, this.executeLine );

  var backHistoryShortcut = new QShortcut( this );
  backHistoryShortcut.key = new QKeySequence( QKeySequence.StandardKey( QKeySequence.MoveToPreviousPage ) );
  backHistoryShortcut.activated.connect( this, this.backHistory );

  var forwardHistoryShortcut = new QShortcut( this );
  forwardHistoryShortcut.key = new QKeySequence( QKeySequence.StandardKey( QKeySequence.MoveToNextPage ) );
  forwardHistoryShortcut.activated.connect( this, this.forwardHistory );

  var explanationItem = new QListWidgetItem("The MuseScore Plugin Console allows you to easily execute JavaScript with access to all functions\nand methods you would have in an MuseScore plugin.\nExecute code: CTRL-Enter\nBack in code history: Page Up\nForward in code history: Page Down\nNote that if you use the 'var' keyword, you won't be able to access that variable in subsequent entries.");
  //explanationItem.setForeground( new QBrush( new QColor(Qt.darkGray) ) );
  explanationItem.setFlags( !Qt.ItemIsSelectable );
  this.historyList.addItem( explanationItem );

  var layout = new QGridLayout( mainWidget );
  layout.addWidget( this.historyList, 0, 0, 1, 2 );
  layout.addWidget( this.inputLine, 1, 0, 3, 2 );
  layout.addWidget( this.executeButton, 4, 1 );
  mainWidget.setLayout( layout );
  this.setCentralWidget( mainWidget );
  this.resize(750, 400);
  this.show();
}

ScriptConsoleMainWindow.prototype = new QMainWindow();

ScriptConsoleMainWindow.prototype.executeLine = function()
{
    command = new QListWidgetItem( this.inputLine.plainText );
    this.commandArray.unshift( this.inputLine.plainText );
    boldFont = new QFont();
    boldFont.setBold( true );
    command.setFont( boldFont );
    result = globalScopeEval.call( null, this.inputLine.plainText );
    resultsRow = new QListWidgetItem( result );
    this.historyList.addItem( command  );
    this.historyList.addItem( resultsRow );
    this.historyList.setCurrentItem( resultsRow );
    this.inputLine.plainText = "";
    this.commandPos = -1;
}

ScriptConsoleMainWindow.prototype.backHistory = function()
{
  if( this.commandArray.length > ( this.commandPos + 1 ) )
  {
      this.commandPos++;
  }
  if( this.commandArray.length > 0 )
  {
    this.inputLine.plainText = this.commandArray[ this.commandPos ];
  }
  Amarok.debug( "back, " + this.commandArray[ this.commandPos ] );
}

ScriptConsoleMainWindow.prototype.forwardHistory = function()
{
  if( this.commandArray.length > 0 )
  {
    if( this.commandPos > 0 )
    {
      this.commandPos--;
    }
    this.inputLine.plainText = this.commandArray[ this.commandPos ];
  }
  Amarok.debug( "forward, " + this.commandPos + ": " + this.commandArray[ this.commandPos ] );
}


//---------------------------------------------------------
//    init
//    this function will be called on startup of
//    mscore
//---------------------------------------------------------

function init()
      {
      // print("test script init");
      };

function run()
      {
      scriptConsoleMainWindow = new ScriptConsoleMainWindow();
      }

//---------------------------------------------------------
//    menu:  defines were the function will be placed
//           in the menu structure
//---------------------------------------------------------

var mscorePlugin = {
      menu: 'Plugins.Plugin console',
      init: init,
      run:  run
      };

mscorePlugin;
